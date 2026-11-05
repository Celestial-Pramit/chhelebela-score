"use client";

import { MotionConfig, motion } from "motion/react";
import TvFrame from "@/components/shared/TvFrame";
import ColorBars from "@/components/shared/ColorBars";
import StickerButton from "@/components/shared/StickerButton";
import { RickshawArch, PetalBand } from "@/components/shared/RickshawArch";
import { Sticker, Cassette, EidCard, Marbles } from "@/components/shared/Objects";

const STEPS = [
  { n: "১", t: "টিক দাও", d: "যা যা তোমার ছেলেবেলায় ছিল" },
  { n: "২", t: "স্কোর দেখো", d: "তুমি কত পার্সেন্ট ৯০-এর কিড" },
  { n: "৩", t: "বন্ধুর সঙ্গে মেলাও", d: "কার ছেলেবেলা বেশি রঙিন?" },
];

export default function Home() {
  return (
    <MotionConfig reducedMotion="user">
      <main className="paper min-h-screen overflow-x-clip">
        {/* Masthead */}
        <motion.header
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mx-auto flex max-w-6xl items-center justify-between border-b-4 border-double border-night px-5 py-3 font-display text-xs font-bold sm:text-sm"
        >
          <span>ছেলেবেলা চ্যানেল · সংখ্যা ০১</span>
          <span>১৯৯০ – ২০০৯</span>
        </motion.header>

        <section className="mx-auto flex max-w-6xl flex-col items-center px-4 pb-14 pt-10 md:pt-14">
          {/* Title */}
          <h1 className="flex flex-wrap items-center justify-center gap-x-[0.3em] font-display text-[clamp(3rem,13vw,7.5rem)] font-extrabold leading-[1.3] text-night">
            <motion.span
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 110, damping: 14 }}
            >
              ছেলেবেলা
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 36, rotate: 0 }}
              animate={{ opacity: 1, y: 0, rotate: -3 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 110, damping: 12 }}
              className="inline-block rounded-[0.2em] border-[0.06em] border-night bg-hotpink px-[0.25em] text-[0.62em] leading-[1.2] text-night shadow-[0.07em_0.07em_0_#15152d]"
            >
              স্কোর
            </motion.span>
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-2 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-night/70 sm:text-xs"
          >
            A journey through our childhood memories.
          </motion.p>

          {/* Stage: arch + TV + objects */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative mx-auto mt-6 w-[90%] max-w-[42rem] md:mt-8 md:w-full"
          >
            <RickshawArch className="pointer-events-none absolute left-1/2 top-0 z-0 h-[calc(100%+1rem)] w-[150%] -translate-x-1/2 md:aspect-[1000/500] md:h-auto md:w-[185%]" />

            {/* Eid card tucked behind the TV */}
            <Sticker
              rotate={9}
              delay={1.9}
              className="absolute -right-[10%] top-[4%] z-[1] w-[26%] md:-right-[16%] md:top-[12%] md:w-[19%]"
            >
              <EidCard className="w-full" />
            </Sticker>

            <div className="relative z-10 pt-10 md:pt-14">
              <TvFrame channel="০১" delay={1.3}>
                <div className="relative flex h-full w-full flex-col items-center justify-center gap-1.5 bg-[radial-gradient(ellipse_at_50%_35%,#1d4a47_0%,#0d2523_80%)] px-[8%] text-center sm:gap-3">
                  <p className="font-display text-[clamp(1.15rem,4.6vw,2.2rem)] font-extrabold leading-[1.3] text-balance text-marigold [text-shadow:0_0_14px_rgba(255,190,40,0.45)]">
                    তুমি কত পার্সেন্ট <span className="whitespace-nowrap">৯০-এর</span> কিড?
                  </p>
                  <p className="text-[clamp(0.7rem,2.6vw,1.05rem)] leading-snug text-paper/85">
                    চলো ফিরে যাই আমাদের সেই ছোটবেলায়...
                  </p>
                  <div className="absolute inset-x-[14%] bottom-[9%] h-1.5 overflow-hidden rounded-full opacity-80 sm:h-2">
                    <ColorBars />
                  </div>
                </div>
              </TvFrame>
            </div>

            {/* Cassette in front, bottom-left (both layouts) */}
            <Sticker
              rotate={-8}
              delay={1.7}
              className="absolute -left-[8%] bottom-[-3%] z-20 w-[34%] md:-left-[17%] md:bottom-[-3%] md:w-[28%]"
            >
              <Cassette className="w-full" />
            </Sticker>

            {/* Marbles: desktop only */}
            <Sticker
              rotate={6}
              delay={2.1}
              className="absolute -right-[14%] bottom-[-2%] z-20 hidden w-[24%] md:block"
            >
              <Marbles className="w-full" />
            </Sticker>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.5 }}
            className="mt-12 flex flex-col items-center gap-4 md:mt-14"
          >
            <StickerButton tone="yellow" href="/quiz">
              <span>ছোটবেলায় ফিরে চলো</span>
              <motion.span
                aria-hidden="true"
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
              >
                →
              </motion.span>
            </StickerButton>
            <p className="text-xs font-medium text-night/70 sm:text-sm">
              ২ মিনিটের টেস্ট · লগইন লাগবে না · ১০০+ স্মৃতি
            </p>
          </motion.div>

          {/* How it works */}
          <ol className="mt-14 grid w-full max-w-3xl grid-cols-1 gap-5 sm:grid-cols-3">
            {STEPS.map((s) => (
              <li key={s.n} className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border-[3px] border-night bg-marigold font-display text-lg font-extrabold">
                  {s.n}
                </span>
                <div>
                  <p className="font-display text-lg font-bold leading-tight">{s.t}</p>
                  <p className="text-sm leading-snug text-night/70">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <PetalBand />
      </main>
    </MotionConfig>
  );
}
