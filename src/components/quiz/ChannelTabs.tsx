"use client";

import { useEffect, useRef, type KeyboardEvent } from "react";
import type { Channel, ChannelId } from "@/data/items";
import { toBanglaDigits } from "@/lib/scoring";
import { getChannelIndexForKey } from "@/lib/quiz";

type Props = {
  channels: readonly Channel[];
  currentChannel: ChannelId;
  doneChannels: readonly ChannelId[];
  onSelect: (channel: ChannelId) => void;
  reducedMotion: boolean;
};

export default function ChannelTabs({
  channels,
  currentChannel,
  doneChannels,
  onSelect,
  reducedMotion,
}: Props) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const currentIndex = channels.findIndex((channel) => channel.id === currentChannel);

  useEffect(() => {
    refs.current[currentIndex]?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [currentIndex, reducedMotion]);

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const nextIndex = getChannelIndexForKey(currentIndex, channels.length, event.key);
    if (nextIndex === null) return;
    event.preventDefault();
    onSelect(channels[nextIndex].id);
    refs.current[nextIndex]?.focus();
  }

  return (
    <div className="relative">
      <nav className="flex gap-2 overflow-x-auto px-1 pb-2" aria-label="চ্যানেল বাছাই">
        {channels.map((channel, index) => {
          const isCurrent = channel.id === currentChannel;
          const isDone = doneChannels.includes(channel.id);
          return (
            <button
              key={channel.id}
              ref={(element) => {
                refs.current[index] = element;
              }}
              type="button"
              aria-current={isCurrent ? "true" : undefined}
              onClick={() => onSelect(channel.id)}
              onKeyDown={handleKeyDown}
              className={`flex min-h-11 shrink-0 items-center gap-1 rounded-full border-2 px-3 font-display text-sm font-bold ${
                reducedMotion ? "transition-none" : "transition"
              } ${
                isCurrent
                  ? "border-night bg-marigold text-night shadow-[3px_3px_0_#15152d]"
                  : "border-night/40 bg-paper/70 text-night/75"
              } focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-night`}
            >
              {isDone && <span aria-label="শেষ হয়েছে">✓</span>}
              <span>
                {toBanglaDigits(index + 1)} {channel.short}
              </span>
            </button>
          );
        })}
      </nav>
      <p className="sr-only" aria-live="polite">
        {channels[currentIndex]?.name} চ্যানেল
      </p>
    </div>
  );
}
