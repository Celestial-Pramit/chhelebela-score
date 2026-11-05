"use client";

import { toBanglaDigits } from "@/lib/scoring";

type Props = {
  currentIndex: number;
  channelCount: number;
  doneCount: number;
  resultMessage?: string;
  onPrevious: () => void;
  onNext: () => void;
  onResult: () => void;
  onReset: () => void;
};

export default function QuizActionBar({
  currentIndex,
  channelCount,
  doneCount,
  resultMessage,
  onPrevious,
  onNext,
  onResult,
  onReset,
}: Props) {
  return (
    <div className="sticky bottom-0 z-30 border-t-2 border-night bg-paper/95 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur md:static md:border-0 md:bg-transparent md:pt-0 md:backdrop-blur-none">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-2 px-3 md:px-0">
        <button
          type="button"
          onClick={onPrevious}
          disabled={currentIndex === 0}
          className="min-h-11 rounded-full border-2 border-night px-3 font-display text-sm font-bold disabled:opacity-35 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-night"
        >
          ← আগের চ্যানেল
        </button>
        <button
          type="button"
          onClick={onNext}
          className="min-h-11 rounded-full border-2 border-night bg-marigold px-3 font-display text-sm font-bold shadow-[3px_3px_0_#15152d] focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-night"
        >
          পরের চ্যানেল →
        </button>
        <span className="basis-full text-center text-xs font-semibold md:basis-auto">
          {toBanglaDigits(doneCount)} / {toBanglaDigits(channelCount)} চ্যানেল শেষ
        </span>
        <button
          type="button"
          onClick={onResult}
          className="min-h-10 rounded-full px-3 text-xs font-bold underline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-night"
        >
          রেজাল্ট দেখো
        </button>
        {resultMessage && <span className="text-xs font-semibold">{resultMessage}</span>}
        <button
          type="button"
          onClick={onReset}
          className="min-h-10 px-2 text-xs font-semibold underline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-night"
        >
          নতুন করে শুরু
        </button>
      </div>
    </div>
  );
}
