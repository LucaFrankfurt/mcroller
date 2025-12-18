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
  "Allgemeine Beratung",
];

type FreeSlot = {
  startUtc: string;
  endUtc: string;
  startLocal: string;
  endLocal: string;
  label: string;
};

export function AppointmentForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<AppointmentFormData>({
    name: "",
    email: "",
    phone: "",
    appointmentType: appointmentTypes[0],
    preferredDate: getTodayDateString(),
    preferredTime: "",
    notes: "",
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

  const canContinueFromStep1 = useMemo(() => {
    return !!(formData.name.trim() && formData.email.trim() && formData.phone.trim());
  }, [formData.email, formData.name, formData.phone]);

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      appointmentType: appointmentTypes[0],
      preferredDate: getTodayDateString(),
      preferredTime: "",
      notes: "",
    });
    setStep(1);
  };

  const handleChange =
    (field: keyof AppointmentFormData) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const value = event.target.value;

      setFormData((prev) => ({
        ...prev,
        [field]: value,
        ...(field === "preferredDate" ? { preferredTime: "" } : {}),
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
          signal: controller.signal,
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
    const timeFromLabel = slot.startLocal?.split("T")[1]?.slice(0, 5);
    const fallbackTime = slot.startUtc ? new Date(slot.startUtc).toISOString().slice(11, 16) : "";
    const chosenTime = timeFromLabel || fallbackTime;

    if (!chosenTime) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      preferredTime: chosenTime,
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
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json().catch(() => ({}));

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
    <div className="rustic-card p-6 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold text-olive-900">Termin anfragen</h3>
          <p className="text-dark-brown/75">
            In zwei kurzen Schritten – Kontaktdaten, dann Terminwunsch. Wir melden uns schnellstmöglich.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wide ${
              step === 1
                ? "border-mustard/40 bg-mustard/10 text-mustard-700"
                : "border-olive/25 bg-cream/70 text-dark-brown/70"
            }`}
          >
            1 Kontakt
          </span>
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wide ${
              step === 2
                ? "border-mustard/40 bg-mustard/10 text-mustard-700"
                : "border-olive/25 bg-cream/70 text-dark-brown/70"
            }`}
          >
            2 Termin
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {step === 1 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="flex flex-col text-left text-dark-brown text-sm font-medium">
              Vollständiger Name*
              <input
                type="text"
                value={formData.name}
                onChange={handleChange("name")}
                className="mt-2 rounded-xl border border-olive/30 bg-cream px-4 py-3 text-dark-brown placeholder:text-dark-brown/40 focus:border-mustard focus:outline-none focus:ring-2 focus:ring-mustard/25"
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
                className="mt-2 rounded-xl border border-olive/30 bg-cream px-4 py-3 text-dark-brown placeholder:text-dark-brown/40 focus:border-mustard focus:outline-none focus:ring-2 focus:ring-mustard/25"
                placeholder="max@beispiel.de"
                required
              />
            </label>
            <label className="flex flex-col text-left text-dark-brown text-sm font-medium md:col-span-2">
              Telefonnummer*
              <input
                type="tel"
                value={formData.phone}
                onChange={handleChange("phone")}
                className="mt-2 rounded-xl border border-olive/30 bg-cream px-4 py-3 text-dark-brown placeholder:text-dark-brown/40 focus:border-mustard focus:outline-none focus:ring-2 focus:ring-mustard/25"
                placeholder="01577 0000000"
                required
              />
            </label>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="flex flex-col text-left text-dark-brown text-sm font-medium">
                Terminart*
                <select
                  value={formData.appointmentType}
                  onChange={handleChange("appointmentType")}
                  className="mt-2 rounded-xl border border-olive/30 bg-cream px-4 py-3 text-dark-brown focus:border-mustard focus:outline-none focus:ring-2 focus:ring-mustard/25"
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
                  className="mt-2 rounded-xl border border-olive/30 bg-cream px-4 py-3 text-dark-brown focus:border-mustard focus:outline-none focus:ring-2 focus:ring-mustard/25"
                  required
                />
              </label>
              <label className="flex flex-col text-left text-dark-brown text-sm font-medium md:col-span-2">
                Wunschzeit*
                <input
                  type="time"
                  value={formData.preferredTime}
                  onChange={handleChange("preferredTime")}
                  className="mt-2 rounded-xl border border-olive/30 bg-cream px-4 py-3 text-dark-brown focus:border-mustard focus:outline-none focus:ring-2 focus:ring-mustard/25"
                  required
                />
                <span className="mt-2 text-xs text-dark-brown/60">
                  Tipp: Wenn du unten ein Zeitfenster auswählst, wird die Uhrzeit automatisch übernommen.
                </span>
              </label>
            </div>

            {formData.preferredDate && (
              <div className="space-y-3 rounded-2xl border border-olive/25 bg-cream/70 p-5">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold uppercase tracking-wide text-olive-700">
                    Verfügbare Zeitfenster (60 Minuten)
                  </span>
                  <span className="text-sm text-dark-brown/65">
                    Basierend auf Google Calendar · auswählen, um die Wunschzeit automatisch zu übernehmen.
                  </span>
                </div>

                {freeSlotsStatus === "loading" && (
                  <p className="text-sm text-dark-brown/65">Lade verfügbare Zeitfenster…</p>
                )}

                {freeSlotsStatus !== "loading" && freeSlots.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {freeSlots.map((slot) => {
                      const slotTime =
                        slot.startLocal?.split("T")[1]?.slice(0, 5) ??
                        new Date(slot.startUtc).toISOString().slice(11, 16);
                      const isSelected = formData.preferredTime === slotTime;

                      return (
                        <button
                          key={`${slot.startUtc}-${slot.endUtc}`}
                          type="button"
                          onClick={() => selectSlot(slot)}
                          className={`rounded-full border px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-mustard/25 ${
                            isSelected
                              ? "border-mustard/50 bg-mustard/15 text-mustard-700"
                              : "border-olive/25 bg-cream text-dark-brown hover:border-mustard/40 hover:bg-mustard/10"
                          }`}
                        >
                          {slot.label}
                        </button>
                      );
                    })}
                  </div>
                )}

                {freeSlotsMessage && (
                  <p className={`text-sm ${freeSlotsStatus === "error" ? "text-red-700" : "text-dark-brown/65"}`}>
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
                className="mt-2 rounded-xl border border-olive/30 bg-cream px-4 py-3 text-dark-brown placeholder:text-dark-brown/40 focus:border-mustard focus:outline-none focus:ring-2 focus:ring-mustard/25"
                placeholder="Bitte Roller-Modell, Laufleistung oder besondere Anliegen nennen."
                rows={4}
              />
            </label>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {step === 1 ? (
            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={status === "loading" || !canContinueFromStep1}
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-mustard px-6 py-3 font-semibold text-cream shadow-sm transition hover:bg-mustard/90 disabled:cursor-not-allowed disabled:bg-olive/30 disabled:text-dark-brown/50"
            >
              Weiter
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setStep(1)}
                disabled={status === "loading"}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-olive/30 bg-cream px-6 py-3 font-semibold text-dark-brown transition hover:bg-cream/70 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Zurück
              </button>
              <button
                type="submit"
                disabled={status === "loading" || isSubmitDisabled}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-mustard px-6 py-3 font-semibold text-cream shadow-sm transition hover:bg-mustard/90 disabled:cursor-not-allowed disabled:bg-olive/30 disabled:text-dark-brown/50"
              >
                {status === "loading" ? "Wird gesendet..." : "Termin anfragen"}
              </button>
            </>
          )}
        </div>

        {status !== "idle" && (
          <div
            className={`rounded-xl border px-4 py-3 text-sm md:text-base ${
              status === "success"
                ? "border-green-500/40 bg-green-50 text-green-900"
                : "border-red-500/40 bg-red-50 text-red-900"
            }`}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
