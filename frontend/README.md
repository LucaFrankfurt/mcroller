# McRoller – Roller Werkstatt Frankfurt am Main

Next.js-App für die McRoller Werkstatt mit Online-Termin-Anfrage und automatischer Erstellung von Terminen im Google Calendar.

## Schnellstart

1. Abhängigkeiten installieren:

```bash
npm install
```

2. Entwicklungsserver starten:

```bash
npm run dev
```

3. Die Seite ist unter [http://localhost:3000](http://localhost:3000) erreichbar.

## Termin-Anfrage & Google Calendar

Kund:innen können über das Formular "Jetzt Termin anfragen" die gewünschte Leistung wählen (z. B. Inspektion, Ölwechsel) und einen Wunschtermin angeben. Die Daten werden an `/api/appointments` gesendet. Der Server erstellt nach erfolgreichem Request automatisch einen Termin im verknüpften Google Calendar.

### Erforderliche Umgebungsvariablen

Legen Sie eine `.env.local` an und hinterlegen Sie die folgenden Werte:

```
GOOGLE_SERVICE_ACCOUNT_EMAIL=service-account@projekt.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_CALENDAR_ID=your-calendar-id@group.calendar.google.com
```

**Hinweise:**

- Verwenden Sie einen Google-Service-Account mit Zugriff auf den gewünschten Kalender und aktivieren Sie die Calendar API in der Google Cloud Console.
- Teilen Sie den Kalender im Web-Interface mit der Service-Account-E-Mail (mindestens Schreibrechte).
- Falls der Private Key Zeilenumbrüche enthält, lassen Sie sie escaped (\n). Der Server konvertiert diese automatisch.

### Request-Payload

Das Formular sendet folgendes JSON an die API:

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

Ein erfolgreicher Request gibt den Status `201` zurück und erstellt ein Event (Standarddauer: 60 Minuten) mit allen Angaben als Beschreibung. Kund:innen werden als Teilnehmer:in hinzugefügt.

## Skripte

- `npm run dev` – Entwicklungsserver (Turbopack)
- `npm run build` – Produktionsbuild (Turbopack)
- `npm run start` – Produktionsserver
- `npm run lint` – Linting mit ESLint

## Deployment

Für das Deployment (z. B. Vercel) müssen die oben genannten Umgebungsvariablen im Hosting-Provider hinterlegt werden.
