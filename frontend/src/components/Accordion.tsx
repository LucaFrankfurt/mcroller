"use client";

import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

type AccordionItemProps = {
  title: string;
  summary?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

export function AccordionItem({ title, summary, children, defaultOpen = false }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <details
      className="group overflow-hidden rounded-3xl border border-olive/20 bg-cream/50 shadow-sm shadow-olive/10 transition-all hover:shadow-lg focus-within:border-mustard/40 focus-within:shadow-lg group-open:border-mustard/40 group-open:bg-cream"
      open={isOpen}
      onToggle={(event) => setIsOpen(event.currentTarget.open)}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-6 py-5 text-left text-olive-700 transition-colors hover:bg-cream/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-mustard-400 group-open:text-olive-900">
        <div className="flex-1">
          <p className="text-lg font-semibold md:text-xl">{title}</p>
          {summary ? <p className="mt-1 text-sm text-dark-brown/70 md:text-base">{summary}</p> : null}
        </div>
        <ChevronDownIcon className="h-6 w-6 flex-shrink-0 text-mustard-500 transition-transform duration-300 group-open:rotate-180" />
      </summary>
      <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out group-open:grid-rows-[1fr]">
        <div className="overflow-hidden px-6 pb-6 pt-1 text-dark-brown/85">
          {children}
        </div>
      </div>
    </details>
  );
}

type AccordionProps = {
  children: React.ReactNode;
  className?: string;
};

export function Accordion({ children, className }: AccordionProps) {
  return <div className={className ? `space-y-6 ${className}` : "space-y-6"}>{children}</div>;
}
