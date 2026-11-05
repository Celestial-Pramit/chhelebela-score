"use client";

import { motion } from "motion/react";
import type { Channel, ChannelId } from "@/data/items";
import { toBanglaDigits } from "@/lib/scoring";

type Props = {
  channel: Channel;
  channelIndex: number;
  channels: readonly Channel[];
  doneChannels: readonly ChannelId[];
  itemCount: number;
  yesCount: number;
  isChanging: boolean;
  reducedMotion: boolean;
};

export default function QuizTv({
  channel,
  channelIndex,
  channels,
  doneChannels,
  itemCount,
  yesCount,
  isChanging,
  reducedMotion,
}: Props) {
  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-[radial-gradient(ellipse_at_50%_35%,#1d4a47_0%,#0d2523_80%)] px-[8%] py-[8%] text-center text-paper">
      {isChanging && !reducedMotion && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.8, 0] }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 z-20 bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.2)_0_1px,rgba(0,0,0,0.28)_1px_3px)]"
          aria-hidden="true"
        />
      )}
      <div className="relative z-10 flex min-h-0 flex-1 items-center justify-center">
        <div>
          <p className="font-display text-[clamp(1.05rem,4.2vw,2rem)] font-extrabold leading-tight text-marigold [text-shadow:0_0_10px_rgba(255,190,40,0.45)]">
            {channel.short}
          </p>
          <p className="mt-1 text-[clamp(0.65rem,2.4vw,0.95rem)] font-bold text-paper/85">
            {toBanglaDigits(channelIndex + 1)} / {toBanglaDigits(channels.length)} চ্যানেল
          </p>
        </div>
      </div>
      <p className="relative z-10 font-display text-[clamp(0.8rem,2.8vw,1.15rem)] font-bold text-paper">
        {toBanglaDigits(yesCount)} / {toBanglaDigits(itemCount)} টিক
      </p>
      <div
        className="relative z-10 mt-2 flex justify-center gap-1.5"
        role="img"
        aria-label={`${toBanglaDigits(doneChannels.length)}টি চ্যানেল শেষ, এখন ${toBanglaDigits(channelIndex + 1)} নম্বর চ্যানেল`}
      >
        {channels.map((entry) => {
          const isDone = doneChannels.includes(entry.id);
          const isCurrent = entry.id === channel.id;
          return (
            <span
              key={entry.id}
              className={`h-2 w-2 rounded-full border border-night ${
                isCurrent ? "bg-marigold" : isDone ? "bg-parrot" : "bg-paper/35"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
