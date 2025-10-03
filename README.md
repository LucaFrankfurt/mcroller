# McRoller – Roller Werkstatt Frankfurt am Main

Zweiteiliges Projekt mit einem Next.js-Frontend (`frontend/`) und einem Express-Backend (`backend/`).

Das Frontend stellt die Website und das Terminformular bereit. Das Backend verwaltet die Google-Calendar-Integration für Terminbuchung und freie Slots.

## Schnellstart

```text
mcroller/
├─ backend/   ← Express-API
└─ frontend/  ← Next.js App Router UI
```

1. Abhängigkeiten installieren:

	```bash
	cd backend
	npm install
	cd ../frontend
	npm install
	```

2. Entwicklungsserver starten (zwei Terminals):

	Backend (Port 4000):

	```bash
	cd backend
	npm run dev
	```

	Frontend (Port 3000):

	```bash
	cd frontend
	npm run dev
	```

3. Die Website läuft unter [http://localhost:3000](http://localhost:3000). Das Backend lauscht standardmäßig auf [http://localhost:4000](http://localhost:4000).

## Termin-Anfrage & Google Calendar

Das Formular "Jetzt Termin anfragen" sendet seine Daten an das Backend (`POST /api/appointments`). Dort wird nach erfolgreicher Validierung automatisch ein Termin in Google Calendar angelegt.

### Erforderliche Umgebungsvariablen

#### Backend (`backend/.env` – Beispiel in `.env.example`)

```
GOOGLE_SERVICE_ACCOUNT_EMAIL=service-account@projekt.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_CALENDAR_ID=your-calendar-id@group.calendar.google.com
APPOINTMENT_DURATION_MINUTES=60
CORS_ORIGINS=http://localhost:3000
ENABLE_ATTENDEE_INVITES=false
PORT=4000
```

#### Frontend (`frontend/.env.local` – Beispiel in `.env.example`)

```
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
```

**Hinweise:**

- Verwenden Sie einen Google-Service-Account mit Zugriff auf den gewünschten Kalender und aktivieren Sie die Calendar API in der Google Cloud Console.
- Teilen Sie den Kalender im Web-Interface mit der Service-Account-E-Mail (mindestens Schreibrechte).
- Falls der Private Key Zeilenumbrüche enthält, lassen Sie sie escaped (\n). Der Server konvertiert diese automatisch.

### Request-Payload

Das Formular sendet folgendes JSON an `POST /api/appointments` des Backends:

```json
{
	"name": "Max Mustermann",
	"email": "max@example.com",
	"phone": "+49 1577 1234567",
	"appointmentType": "Inspektion",
	"preferredDate": "2025-10-15",
	"preferredTime": "10:30",
	"notes": "Optionaler Hinweis"
}
```

Ein erfolgreicher Request gibt den Status `201` zurück und erstellt ein Event (Standarddauer: 60 Minuten) mit allen Angaben als Beschreibung. Kund:innen werden nur dann als Teilnehmer:in hinzugefügt, wenn `ENABLE_ATTENDEE_INVITES=true` gesetzt ist **und** der Service-Account über Domain-Wide Delegation verfügt. Andernfalls werden die Kontaktdaten lediglich in der Beschreibung gespeichert.

## Freie Slots abrufen (`/api/freebusy`)

Der Read-Only-Endpunkt `GET /api/freebusy` (Backend) liefert verfügbare Zeitslots für einen Tag. Standardzeitfenster: 08:00 – 18:00, Slotdauer 60 Minuten, Raster 30 Minuten, Zeitzone `Europe/Berlin`.

### Query-Parameter

| Parameter | Pflicht | Beschreibung |
|-----------|---------|--------------|
| `date` | ✅ | Datum im Format `YYYY-MM-DD` |
| `startTime` | ❌ | Arbeitsbeginn (Standard `08:00`) |
| `endTime` | ❌ | Arbeitsende (Standard `18:00`) |
| `durationMinutes` | ❌ | Länge eines Slots in Minuten (Standard `60`) |
| `intervalMinutes` | ❌ | Schrittweite zwischen Slots (Standard `30`, wird nie länger als die Slotdauer) |
| `timeZone` | ❌ | IANA-TZ-Name (Standard `Europe/Berlin`) |

### Beispielanfrage

```bash
curl "http://localhost:4000/api/freebusy?date=2025-10-09"
```

### Beispielantwort

```json
{
	"freeSlots": [
		{
			"startUtc": "2025-10-09T06:00:00.000Z",
			"endUtc": "2025-10-09T07:00:00.000Z",
			"startLocal": "2025-10-09T08:00:00+02:00",
			"endLocal": "2025-10-09T09:00:00+02:00",
			"label": "08:00 – 09:00"
		}
	],
	"meta": {
		"date": "2025-10-09",
		"timeZone": "Europe/Berlin",
		"startTime": "08:00",
		"endTime": "18:00",
		"durationMinutes": 60,
	"intervalMinutes": 30
	}
}
```

Das Frontend kann dadurch freie Termine für Kund:innen visualisieren, indem es die Slots filtert oder gruppiert. Für die Kalender-Abfrage werden dieselben Service-Account-Zugangsdaten wie für `/api/appointments` genutzt.

## Skripte

### Frontend (`frontend/`)

- `npm run dev` – Entwicklungsserver (Turbopack)
- `npm run build` – Produktionsbuild (Turbopack)
- `npm run start` – Produktionsserver
- `npm run lint` – Linting mit ESLint

### Backend (`backend/`)

- `npm run dev` – Backend im Watch-Modus (nodemon)
- `npm run start` – Produktionsstart (Node.js)

## Deployment

Frontend und Backend können unabhängig voneinander deployt werden. Stellen Sie sicher, dass:

- das Backend die oben genannten Service-Account-Variablen erhält und erreichbar ist,
- das Frontend die korrekte Backend-Basis-URL (`NEXT_PUBLIC_BACKEND_URL`) kennt,
- CORS so konfiguriert ist, dass das Frontend auf das Backend zugreifen darf (Variable `CORS_ORIGINS`).
