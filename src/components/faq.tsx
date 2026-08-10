"use client";

import { useId, useState, type ReactNode } from "react";

export type FaqItem = {
  question: string;
  /** Plain paragraphs, or a bullet list when the answer enumerates options. */
  answer: string | string[];
};

/**
 * The documented ".faq" accordion: bordered items with --radius-sm, a "+" icon
 * that rotates 45° into an "×" when open, and an answer that collapses via
 * grid-template-rows (no JS height measurement).
 */
export function Faq({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const baseId = useId();

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const questionId = `${baseId}-q-${index}`;
        const answerId = `${baseId}-a-${index}`;

        return (
          <div
            key={item.question}
            className="overflow-hidden rounded-sm border border-border bg-white"
          >
            <h3 className="m-0">
              <button
                type="button"
                id={questionId}
                aria-expanded={isOpen}
                aria-controls={answerId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="font-head flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold text-navy"
              >
                <span>{item.question}</span>
                <span
                  aria-hidden="true"
                  className={`relative size-4 shrink-0 transition-transform duration-150 ${
                    isOpen ? "rotate-45" : ""
                  }`}
                >
                  <span className="absolute top-1/2 left-0 h-0.5 w-full -translate-y-1/2 bg-navy" />
                  <span className="absolute top-0 left-1/2 h-full w-0.5 -translate-x-1/2 bg-navy" />
                </span>
              </button>
            </h3>

            <div
              id={answerId}
              role="region"
              aria-labelledby={questionId}
              className={`grid transition-[grid-template-rows] duration-200 ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="font-body px-5 pb-4 text-ink-soft">
                  {Array.isArray(item.answer) ? (
                    <ul className="flex list-disc flex-col gap-1 pl-5">
                      {item.answer.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>{item.answer}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Renders the FAQPage JSON-LD from the same array the accordion uses, so the
 *  structured data cannot drift out of sync with what is on screen. */
export function FaqJsonLd({ items }: { items: FaqItem[] }): ReactNode {
  const json = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: Array.isArray(item.answer)
          ? item.answer.map((l) => `• ${l}`).join(" ")
          : item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
