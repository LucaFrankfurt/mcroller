import "dotenv/config";

import cors from "cors";
import express from "express";
import morgan from "morgan";
import { google } from "googleapis";
import { formatISO } from "date-fns";
import { formatInTimeZone, zonedTimeToUtc } from "date-fns-tz";

const DEFAULT_TIME_ZONE = "Europe/Berlin";
const DEFAULT_START_TIME = "08:00";
const DEFAULT_END_TIME = "18:00";
const DEFAULT_DURATION_MINUTES = 60;
const DEFAULT_INTERVAL_MINUTES = 30;
const READ_ONLY_SCOPE = "https://www.googleapis.com/auth/calendar.readonly";
const WRITE_SCOPE = "https://www.googleapis.com/auth/calendar";

const timeRegex = /^\d{2}:\d{2}$/;
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

const app = express();

const corsOrigins = process.env.CORS_ORIGINS?.split(",").map((origin) => origin.trim()).filter(Boolean) ?? [];
app.use(
  cors({
    origin: corsOrigins.length > 0 ? corsOrigins : "*",
    credentials: false
  })
);
app.use(express.json());
app.use(morgan("dev"));

function getServiceAccountClient(scopes) {
  const clientEmail =
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ?? process.env.GOOGLE_CLIENT_EMAIL ?? "";
  const privateKey =
    process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY ?? process.env.GOOGLE_PRIVATE_KEY ?? "";

  if (!clientEmail || !privateKey) {
    throw new Error(
      "Google Calendar Service-Account Zugangsdaten fehlen. Bitte GOOGLE_SERVICE_ACCOUNT_EMAIL und GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY setzen."
    );
  }

  const sanitizedKey = privateKey.replace(/\\n/g, "\n");

  return new google.auth.JWT({
    email: clientEmail,
    key: sanitizedKey,
    scopes
  });
}

function getCalendar(scopes) {
  return google.calendar({ version: "v3", auth: getServiceAccountClient(scopes) });
}

function parsePositiveInteger(value, fallback) {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function validateTimeString(value, fallback) {
  if (!value || !timeRegex.test(value)) {
    return fallback;
  }
  return value;
}

function validateDateString(value) {
  if (!value || !dateRegex.test(value)) {
    return null;
  }
  return value;
}

function calculateFreeSlots({ busySlots, windowStartUtc, windowEndUtc, slotDurationMinutes, intervalMinutes, timeZone }) {
  const slotDurationMs = slotDurationMinutes * 60 * 1000;
  const intervalMs = intervalMinutes * 60 * 1000;

  if (slotDurationMs <= 0 || intervalMs <= 0) {
    return [];
  }

  const sanitizedBusySlots = (busySlots ?? [])
    .map((slot) =>
      slot.start && slot.end
        ? {
            start: new Date(slot.start),
            end: new Date(slot.end)
          }
        : null
    )
    .filter((slot) => slot !== null)
    .filter((slot) => slot && !Number.isNaN(slot.start.getTime()) && !Number.isNaN(slot.end.getTime()) && slot.start < slot.end)
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  const freeSlots = [];

  for (
    let currentStart = new Date(windowStartUtc);
    currentStart.getTime() + slotDurationMs <= windowEndUtc.getTime();
    currentStart = new Date(currentStart.getTime() + intervalMs)
  ) {
    const currentEnd = new Date(currentStart.getTime() + slotDurationMs);

    if (currentEnd > windowEndUtc) {
      break;
    }

    const overlapsBusySlot = sanitizedBusySlots.some((slot) => currentStart < slot.end && currentEnd > slot.start);

    if (!overlapsBusySlot) {
      freeSlots.push({
        startUtc: formatISO(currentStart),
        endUtc: formatISO(currentEnd),
        startLocal: formatInTimeZone(currentStart, timeZone, "yyyy-MM-dd'T'HH:mmXXX"),
        endLocal: formatInTimeZone(currentEnd, timeZone, "yyyy-MM-dd'T'HH:mmXXX"),
        label: `${formatInTimeZone(currentStart, timeZone, "HH:mm")} – ${formatInTimeZone(currentEnd, timeZone, "HH:mm")}`
      });
    }
  }

  return freeSlots;
}

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "mcroller-backend" });
});

app.post("/api/appointments", async (req, res) => {
  const payload = req.body ?? {};

  const requiredFields = ["name", "email", "phone", "appointmentType", "preferredDate", "preferredTime"];
  const missingFields = requiredFields.filter((field) => !payload[field] || !String(payload[field]).trim());

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: `Folgende Felder fehlen oder sind leer: ${missingFields.join(", ")}`
    });
  }

  const calendarId = process.env.GOOGLE_CALENDAR_ID;

  if (!calendarId) {
    return res.status(500).json({ error: "GOOGLE_CALENDAR_ID ist nicht gesetzt." });
  }

  try {
    const calendar = getCalendar([WRITE_SCOPE]);

    const startDate = new Date(`${payload.preferredDate}T${payload.preferredTime}:00`);

    if (Number.isNaN(startDate.getTime())) {
      return res.status(400).json({ error: "Ungültiges Datum oder Uhrzeit übermittelt." });
    }

    const durationMinutes = Number.parseInt(process.env.APPOINTMENT_DURATION_MINUTES ?? "60", 10);
    const durationMs = Number.isFinite(durationMinutes) && durationMinutes > 0 ? durationMinutes * 60 * 1000 : 60 * 60 * 1000;
    const endDate = new Date(startDate.getTime() + durationMs);

    const allowAttendeeInvites = process.env.ENABLE_ATTENDEE_INVITES === "true";

    const requestBody = {
      summary: `${payload.appointmentType} – ${payload.name}`,
      description: [
        `Terminart: ${payload.appointmentType}`,
        `Kunde: ${payload.name}`,
        `E-Mail: ${payload.email}`,
        `Telefon: ${payload.phone}`,
        payload.notes ? `Notizen: ${payload.notes}` : undefined
      ]
        .filter(Boolean)
        .join("\n"),
      start: {
        dateTime: startDate.toISOString(),
        timeZone: DEFAULT_TIME_ZONE
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: DEFAULT_TIME_ZONE
      },
      ...(allowAttendeeInvites
        ? {
            attendees: [
              {
                email: payload.email,
                displayName: payload.name
              }
            ]
          }
        : {})
    };

    await calendar.events.insert({
      calendarId,
      requestBody,
      sendUpdates: allowAttendeeInvites ? "all" : "none"
    });

    return res.status(201).json({
      message: "Termin wurde angefragt und in Google Calendar gespeichert. Wir melden uns zeitnah!"
    });
  } catch (error) {
    console.error("Failed to create Google Calendar event", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Beim Erstellen des Termins ist ein Fehler aufgetreten. Bitte später erneut versuchen."
    });
  }
});

app.get("/api/freebusy", async (req, res) => {
  const dateParam = validateDateString(req.query.date);

  if (!dateParam) {
    return res.status(400).json({
      error: "Der Parameter 'date' wird benötigt und muss im Format YYYY-MM-DD vorliegen."
    });
  }

  const calendarId = process.env.GOOGLE_CALENDAR_ID;

  if (!calendarId) {
    return res.status(500).json({ error: "GOOGLE_CALENDAR_ID ist nicht gesetzt." });
  }

  const timeZone = req.query.timeZone || DEFAULT_TIME_ZONE;
  const startTime = validateTimeString(req.query.startTime, DEFAULT_START_TIME);
  const endTime = validateTimeString(req.query.endTime, DEFAULT_END_TIME);
  const durationMinutes = parsePositiveInteger(req.query.durationMinutes, DEFAULT_DURATION_MINUTES);
  const intervalRaw = parsePositiveInteger(req.query.intervalMinutes, DEFAULT_INTERVAL_MINUTES);
  const intervalMinutes = Math.min(intervalRaw, durationMinutes);

  const windowStartUtc = zonedTimeToUtc(`${dateParam}T${startTime}:00`, timeZone);
  const windowEndUtc = zonedTimeToUtc(`${dateParam}T${endTime}:00`, timeZone);

  if (windowEndUtc <= windowStartUtc) {
    return res.status(400).json({ error: "startTime muss vor endTime liegen." });
  }

  if (durationMinutes * 60 * 1000 > windowEndUtc.getTime() - windowStartUtc.getTime()) {
    return res.status(400).json({ error: "Die gewünschte Slot-Dauer passt nicht innerhalb des angegebenen Zeitfensters." });
  }

  try {
    const calendar = getCalendar([READ_ONLY_SCOPE]);

    const response = await calendar.freebusy.query({
      requestBody: {
        timeMin: windowStartUtc.toISOString(),
        timeMax: windowEndUtc.toISOString(),
        timeZone,
        items: [{ id: calendarId }]
      }
    });

    const busySlots = response.data.calendars?.[calendarId]?.busy ?? [];

    const freeSlots = calculateFreeSlots({
      busySlots,
      windowStartUtc,
      windowEndUtc,
      slotDurationMinutes: durationMinutes,
      intervalMinutes,
      timeZone
    });

    return res.json({
      freeSlots,
      meta: {
        date: dateParam,
        timeZone,
        startTime,
        endTime,
        durationMinutes,
        intervalMinutes
      }
    });
  } catch (error) {
    console.error("Failed to fetch free slots", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Beim Abrufen der freien Termine ist ein Fehler aufgetreten."
    });
  }
});

const PORT = Number.parseInt(process.env.PORT ?? "4000", 10);

app.listen(PORT, () => {
  console.log(`mcroller-backend listening on port ${PORT}`);
});
