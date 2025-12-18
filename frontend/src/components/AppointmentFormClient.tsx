"use client";

import dynamic from "next/dynamic";

const AppointmentForm = dynamic(
  () => import("./AppointmentForm").then((module) => module.AppointmentForm),
  {
    ssr: false,
    loading: () => (
      <div className="rustic-card p-6 md:p-8">
        <div className="h-6 w-40 rounded bg-olive/10" />
        <div className="mt-3 h-4 w-72 rounded bg-olive/10" />
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="h-12 rounded-xl bg-olive/10" />
          <div className="h-12 rounded-xl bg-olive/10" />
          <div className="h-12 rounded-xl bg-olive/10 md:col-span-2" />
        </div>
      </div>
    ),
  }
);

export function AppointmentFormClient() {
  return <AppointmentForm />;
}
