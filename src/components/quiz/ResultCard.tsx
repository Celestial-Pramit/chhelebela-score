"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import {
  DISCLAIMER,
  TITLE_BANDS,
  toBanglaDigits,
  type ScoreResult,
} from "@/lib/scoring";
import ShareButtons from "./ShareButtons";

type Props = {
  score: ScoreResult;
  onBack: () => void;
  onReset: () => void;
};

const BAR_COLORS = [
  "bg-hotpink",
  "bg-parrot",
  "bg-marigold",
  "bg-teal",
  "bg-vermilion",
  "bg-purple",
  "bg-orange",
] as const;

const FALLBACK_TITLE = TITLE_BANDS[TITLE_BANDS.length - 1].name;
let hasFiredConfetti = false;

export default function ResultCard({ score, onBack, onReset }: Props) {
  const reducedMotion = useReducedMotion() ?? false;
  const [displayPercent, setDisplayPercent] = useState(0);

  useEffect(() => {
    if (score.overall === null) return;
    if (reducedMotion) {
      return;
    }

    const started = performance.now();
    const duration = 1200;
    let frame = 0;
    const update = (now: number) => {
      const progress = Math.min((now - started) / duration, 1);
      setDisplayPercent(Math.round(score.overall! * progress));
      if (progress < 1) frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [reducedMotion, score.overall]);
  const visiblePercent = reducedMotion ? score.overall ?? 0 : displayPercent;

  useEffect(() => {
    if (score.overall === null || reducedMotion || hasFiredConfetti) return;
    hasFiredConfetti = true;
    let cancelled = false;
    void import("canvas-confetti").then(({ default: confetti }) => {
      if (!cancelled) confetti({ particleCount: 90, spread: 70, origin: { y: 0.65 } });
    });
    return () => {
      cancelled = true;
    };
  }, [reducedMotion, score.overall]);

  return (
    <main className="paper min-h-screen px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <article className="rotate-[-1deg] rounded-xl border-4 border-night bg-paper p-5 text-center shadow-[8px_8px_0_#15152d] sm:p-8">
          <p className="font-display text-sm font-extrabold uppercase tracking-[0.18em]">
            ছেলেবেলা চ্যানেল · ফলাফল
          </p>
          <h1
            id="result-title"
            tabIndex={-1}
            className="mt-3 font-display text-4xl font-extrabold focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-night sm:text-5xl"
          >
            ছেলেবেলার স্কোর
          </h1>

          {score.overall === null ? (
            <>
              <p className="mx-auto mt-8 max-w-md text-lg font-semibold">
                এখনো কোনো শেষ করা চ্যানেলে উত্তর পাওয়া যায়নি। আরও কিছু স্মৃতি দেখে স্কোর বানাও।
              </p>
              <button
                type="button"
                onClick={onBack}
                className="mt-6 min-h-11 rounded-full border-2 border-night bg-marigold px-5 font-display font-bold shadow-[3px_3px_0_#15152d] focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-night"
              >
                চ্যানেলে ফিরে যাও
              </button>
            </>
          ) : (
            <>
              <p
                className="mt-3 font-display text-7xl font-extrabold leading-none text-hotpink sm:text-8xl"
                aria-hidden="true"
              >
                {toBanglaDigits(visiblePercent)}%
              </p>
              <span className="sr-only">{toBanglaDigits(score.overall)} শতাংশ</span>
              {score.title && (
                <>
                  <h2 className="mt-5 font-display text-2xl font-extrabold">{score.title.name}</h2>
                  <p className="mt-2 font-semibold">{score.title.description}</p>
                </>
              )}
              {score.eraLabel && (
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  <p className="inline-block -rotate-2 rounded-md border-2 border-night bg-hotpink px-3 py-1 font-display font-bold text-night">
                    {score.eraLabel}
                  </p>
                  <p className="text-sm font-semibold">
                    এটা মজার তুলনা - তোমার জন্মসাল প্রমাণ করে না।
                  </p>
                </div>
              )}

              <section className="mt-7 text-left" aria-labelledby="channel-breakdown-title">
                <h2 id="channel-breakdown-title" className="font-display text-xl font-extrabold">
                  চ্যানেলভিত্তিক স্কোর
                </h2>
                <div className="mt-3 space-y-3">
                  {score.channels.map((channel, index) => (
                    <div key={channel.channel}>
                      <div className="mb-1 flex items-center justify-between gap-3 text-sm font-bold">
                        <span>{channel.name}</span>
                        <span>
                          {channel.percent === null
                            ? "—"
                            : `${toBanglaDigits(channel.percent)}%`}
                        </span>
                      </div>
                      <div
                        className="h-3 overflow-hidden rounded-full border-2 border-night bg-white/50"
                        role="img"
                        aria-label={`${channel.name}: ${
                          channel.percent === null ? "কোনো স্কোর নেই" : `${toBanglaDigits(channel.percent)} শতাংশ`
                        }`}
                      >
                        <div
                          className={`h-full ${BAR_COLORS[index % BAR_COLORS.length]}`}
                          style={{ width: `${channel.percent ?? 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <p className="mt-7 text-sm font-semibold">{DISCLAIMER}</p>
              <ShareButtons
                percent={score.overall}
                title={score.title?.name ?? FALLBACK_TITLE}
                eraLabel={score.eraLabel}
              />
            </>
          )}

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="min-h-11 rounded-full border-2 border-night px-5 font-display font-bold focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-night"
            >
              চ্যানেলে ফিরে যাও
            </button>
            <button
              type="button"
              onClick={onReset}
              className="min-h-11 rounded-full px-4 font-display font-bold underline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-night"
            >
              নতুন করে শুরু
            </button>
          </div>
        </article>
      </div>
    </main>
  );
}
