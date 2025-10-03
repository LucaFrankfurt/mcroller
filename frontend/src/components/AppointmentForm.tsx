"use client";

import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";

const backendBaseUrl = (process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000").replace(/\/$/, "");

const getTodayDateString = () => new Date().toLocaleDateString("en-CA");

type FormStatus = "idle" | "loading" | "success" | "error";

type AppointmentFormData = {
  name: string;
  email: string;
  phone: string;
  appointmentType: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
};

const appointmentTypes = [
  "Inspektion",
  "Ölwechsel",
  "Reifenwechsel",
  "Elektrik-Diagnose",
  "Unfallreparatur",
  "Tuning & Leistungssteigerung",
  "Allgemeine Beratung"
];

type FreeSlot = {
  startUtc: string;
  endUtc: string;
  startLocal: string;
  endLocal: string;
  label: string;
};

export function AppointmentForm() {
  const [formData, setFormData] = useState<AppointmentFormData>({
    name: "",
    email: "",
    phone: "",
    appointmentType: appointmentTypes[0],
    preferredDate: getTodayDateString(),
    preferredTime: "",
    notes: ""
  });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState<string>("");
  const [freeSlots, setFreeSlots] = useState<FreeSlot[]>([]);
  const [freeSlotsStatus, setFreeSlotsStatus] = useState<FormStatus>("idle");
  const [freeSlotsMessage, setFreeSlotsMessage] = useState<string>("");

  const isSubmitDisabled = useMemo(() => {
    return (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.preferredDate ||
      !formData.preferredTime
    );
  }, [formData]);

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      appointmentType: appointmentTypes[0],
      preferredDate: getTodayDateString(),
      preferredTime: "",
      notes: ""
    });
  };

  const handleChange = (field: keyof AppointmentFormData) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const value = event.target.value;

      setFormData((prev) => ({
        ...prev,
        [field]: value,
        ...(field === "preferredDate" ? { preferredTime: "" } : {})
      }));
    };

  useEffect(() => {
    if (!formData.preferredDate) {
      setFreeSlots([]);
      setFreeSlotsStatus("idle");
      setFreeSlotsMessage("");
      return;
    }

    const controller = new AbortController();

    async function loadFreeSlots(selectedDate: string) {
      try {
        setFreeSlotsStatus("loading");
        setFreeSlotsMessage("");

        const query = new URLSearchParams({ date: selectedDate });
        const response = await fetch(`${backendBaseUrl}/api/freebusy?${query.toString()}`, {
          signal: controller.signal
        });

        if (!response.ok) {
          const result = await response.json().catch(() => ({}));
          throw new Error(result?.error ?? "Die freien Termine konnten nicht geladen werden.");
        }

        const data = (await response.json()) as { freeSlots?: FreeSlot[] };
        const slots = data.freeSlots ?? [];

        const filteredSlots = slots.filter((slot) => {
          const startSource = slot.startLocal ?? slot.startUtc;
          const start = startSource ? new Date(startSource) : null;
          return start !== null && !Number.isNaN(start.getTime()) && start.getMinutes() === 0;
        });

        setFreeSlots(filteredSlots);
        setFreeSlotsStatus("success");
        setFreeSlotsMessage(
          filteredSlots.length === 0 ? "Keine freien Zeitfenster auf der vollen Stunde verfügbar." : ""
        );
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setFreeSlots([]);
        setFreeSlotsStatus("error");
        setFreeSlotsMessage(
          error instanceof Error
            ? error.message
            : "Beim Laden der freien Zeitfenster ist ein Fehler aufgetreten."
        );
      }
    }

    loadFreeSlots(formData.preferredDate);

    return () => {
      controller.abort();
    };
  }, [formData.preferredDate]);

  const selectSlot = (slot: FreeSlot) => {
    const timeFromLabel = slot.startLocal.split("T")[1]?.slice(0, 5);
    const fallbackTime = slot.startUtc ? new Date(slot.startUtc).toISOString().slice(11, 16) : "";
    const chosenTime = timeFromLabel || fallbackTime;

    if (!chosenTime) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      preferredTime: chosenTime
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setStatus("loading");
    setMessage("");

    try {
  const response = await fetch(`${backendBaseUrl}/api/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error ?? "Beim Anlegen des Termins ist ein Fehler aufgetreten.");
      }

      setStatus("success");
      setMessage(result?.message ?? "Termin wurde erfolgreich angefragt. Wir melden uns in Kürze!");
      resetForm();
    } catch (error) {
      console.error("Appointment request failed", error);
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Es ist ein unerwarteter Fehler aufgetreten. Bitte versuchen Sie es erneut."
      );
    }
  };

  return (
    <div className="bg-cream border border-olive/30 rounded-xl shadow-lg p-6 md:p-8">
      <h3 className="text-2xl font-semibold text-olive mb-4">Termin online anfragen</h3>
      <p className="text-dark-brown mb-6">
        Wählen Sie die gewünschte Leistung aus und teilen Sie uns Ihren Wunschtermin mit. Wir bestätigen
        Ihren Termin schnellstmöglich.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col text-left text-dark-brown text-sm font-medium">
            Vollständiger Name*
            <input
              type="text"
              value={formData.name}
              onChange={handleChange("name")}
              className="mt-2 rounded-lg border border-olive/40 bg-white px-4 py-3 text-dark-brown focus:border-mustard focus:outline-none focus:ring-2 focus:ring-mustard/50"
              placeholder="Max Mustermann"
              required
            />
          </label>
          <label className="flex flex-col text-left text-dark-brown text-sm font-medium">
            E-Mail-Adresse*
            <input
              type="email"
              value={formData.email}
              onChange={handleChange("email")}
              className="mt-2 rounded-lg border border-olive/40 bg-white px-4 py-3 text-dark-brown focus:border-mustard focus:outline-none focus:ring-2 focus:ring-mustard/50"
              placeholder="max@beispiel.de"
              required
            />
          </label>
          <label className="flex flex-col text-left text-dark-brown text-sm font-medium">
            Telefonnummer*
            <input
              type="tel"
              value={formData.phone}
              onChange={handleChange("phone")}
              className="mt-2 rounded-lg border border-olive/40 bg-white px-4 py-3 text-dark-brown focus:border-mustard focus:outline-none focus:ring-2 focus:ring-mustard/50"
              placeholder="01577 0000000"
              required
            />
          </label>
          <label className="flex flex-col text-left text-dark-brown text-sm font-medium">
            Terminart*
            <select
              value={formData.appointmentType}
              onChange={handleChange("appointmentType")}
              className="mt-2 rounded-lg border border-olive/40 bg-white px-4 py-3 text-dark-brown focus:border-mustard focus:outline-none focus:ring-2 focus:ring-mustard/50"
              required
            >
              {appointmentTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col text-left text-dark-brown text-sm font-medium">
            Wunschdatum*
            <input
              type="date"
              value={formData.preferredDate}
              onChange={handleChange("preferredDate")}
              className="mt-2 rounded-lg border border-olive/40 bg-white px-4 py-3 text-dark-brown focus:border-mustard focus:outline-none focus:ring-2 focus:ring-mustard/50"
              required
            />
          </label>
          <label className="flex flex-col text-left text-dark-brown text-sm font-medium">
            Wunschzeit*
            <input
              type="time"
              value={formData.preferredTime}
              onChange={handleChange("preferredTime")}
              className="mt-2 rounded-lg border border-olive/40 bg-white px-4 py-3 text-dark-brown focus:border-mustard focus:outline-none focus:ring-2 focus:ring-mustard/50"
              required
            />
          </label>
        </div>

        {formData.preferredDate && (
          <div className="space-y-3 rounded-xl border border-olive/30 bg-cream/70 p-5">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold uppercase tracking-wide text-olive-700">
                Verfügbare Zeitfenster (60 Minuten)
              </span>
              <span className="text-sm text-dark-brown/70">
                Basierend auf Google Calendar – auswählen, um die Wunschzeit automatisch zu übernehmen.
              </span>
            </div>

            {freeSlotsStatus === "loading" && (
              <p className="text-sm text-dark-brown/70">Lade verfügbare Zeitfenster…</p>
            )}

            {freeSlotsStatus !== "loading" && freeSlots.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {freeSlots.map((slot) => {
                  const slotTime = slot.startLocal.split("T")[1]?.slice(0, 5) ?? new Date(slot.startUtc).toISOString().slice(11, 16);
                  const isSelected = formData.preferredTime === slotTime;

                  return (
                    <button
                      key={`${slot.startUtc}-${slot.endUtc}`}
                      type="button"
                      onClick={() => selectSlot(slot)}
                      className={`rounded-lg border px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-mustard/50 ${
                        isSelected
                          ? "border-mustard bg-mustard/20 text-olive-800"
                          : "border-olive/30 bg-white text-dark-brown hover:border-mustard/60 hover:bg-mustard/10"
                      }`}
                    >
                      {slot.label}
                    </button>
                  );
                })}
              </div>
            )}

            {freeSlotsMessage && (
              <p
                className={`text-sm ${
                  freeSlotsStatus === "error" ? "text-red-700" : "text-dark-brown/70"
                }`}
              >
                {freeSlotsMessage}
              </p>
            )}
          </div>
        )}

        <label className="flex flex-col text-left text-dark-brown text-sm font-medium">
          Weitere Hinweise
          <textarea
            value={formData.notes}
            onChange={handleChange("notes")}
            className="mt-2 rounded-lg border border-olive/40 bg-white px-4 py-3 text-dark-brown focus:border-mustard focus:outline-none focus:ring-2 focus:ring-mustard/50"
            placeholder="Bitte Roller-Modell, Laufleistung oder besondere Anliegen nennen."
            rows={4}
          />
        </label>

        <button
          type="submit"
          disabled={status === "loading" || isSubmitDisabled}
          className="w-full md:w-auto inline-flex items-center justify-center rounded-lg bg-olive px-6 py-3 font-semibold text-cream shadow-md transition hover:bg-mustard hover:text-olive disabled:cursor-not-allowed disabled:bg-olive/60"
        >
          {status === "loading" ? "Wird gesendet..." : "Termin anfragen"}
        </button>

        {status !== "idle" && (
          <div
            className={`rounded-lg border px-4 py-3 text-sm md:text-base ${
              status === "success"
                ? "border-green-500/60 bg-green-100 text-green-900"
                : "border-red-500/60 bg-red-100 text-red-900"
            }`}
          >
            {message}
          </div>
        )}
        {status === "idle" && message && (
          <p className="text-sm text-dark-brown/80">{message}</p>
        )}
      </form>
    </div>
  );
}
