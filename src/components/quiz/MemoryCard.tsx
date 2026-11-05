"use client";

import { motion } from "motion/react";
import type { CSSProperties } from "react";
import type { Item } from "@/data/items";
import type { Answer } from "@/lib/scoring";
import { SKIP_LABEL } from "@/lib/copy";
import { toggleAnswer } from "@/lib/quiz";

type Props = {
  item: Item;
  answer: Answer | undefined;
  index: number;
  reducedMotion: boolean;
  onAnswer: (answer: Answer | undefined) => void;
};

export default function MemoryCard({ item, answer, index, reducedMotion, onAnswer }: Props) {
  const isYes = answer === "yes";
  const isSkip = answer === "skip";

  return (
    <article
      id={`memory-card-${item.id}`}
      style={{ "--memory-card-delay": `${Math.min(index * 40, 280)}ms` } as CSSProperties}
      className={`memory-card memory-card-enter relative min-h-14 rounded-lg border-[3px] p-2.5 shadow-[4px_4px_0_#15152d] ${
        isYes
          ? "rotate-[-1deg] border-night bg-marigold"
          : isSkip
            ? "is-skipped border-dashed border-night bg-paper"
            : "border-night bg-paper"
      }`}
    >
      <button
        type="button"
        aria-pressed={isYes}
        onClick={() => onAnswer(toggleAnswer(answer, "yes"))}
        className="flex min-h-11 w-full items-center pr-8 text-left text-base font-semibold leading-snug focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-night"
      >
        {item.text}
      </button>
      {isYes && (
        <motion.span
          initial={reducedMotion ? false : { scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 8 }}
          transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 12 }}
          className="pointer-events-none absolute right-2 top-1 font-display text-3xl font-extrabold text-vermilion"
          aria-hidden="true"
        >
          ✓
        </motion.span>
      )}
      <button
        type="button"
        aria-pressed={isSkip}
        onClick={() => onAnswer(toggleAnswer(answer, "skip"))}
        className={`mt-1 min-h-11 rounded-md px-2 text-sm font-bold underline decoration-2 underline-offset-2 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-night ${
          isSkip ? "text-night" : "text-night/65"
        }`}
      >
        {SKIP_LABEL}
      </button>
    </article>
  );
}
