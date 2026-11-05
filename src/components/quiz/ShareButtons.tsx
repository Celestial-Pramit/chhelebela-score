"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { buildShareText } from "@/lib/share";

type Props = {
  percent: number;
  title: string;
  eraLabel: string | null;
};

type ShareNavigator = Omit<Navigator, "share"> & {
  share?: Navigator["share"];
};

export default function ShareButtons({ percent, title, eraLabel }: Props) {
  const [copied, setCopied] = useState(false);
  const [fallbackVisible, setFallbackVisible] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const copiedTimeoutRef = useRef<number | null>(null);
  const siteUrl = useSyncExternalStore(
    () => () => undefined,
    () => window.location.origin,
    () => "",
  );

  const shareText = useMemo(
    () =>
      buildShareText({
        percent,
        title,
        eraLabel,
          siteUrl,
      }),
      [eraLabel, percent, siteUrl, title],
  );
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl)}`;
  const shareAvailable = useSyncExternalStore(
    () => () => undefined,
    () => typeof navigator.share === "function",
    () => false,
  );

  useEffect(() => {
    return () => {
      if (copiedTimeoutRef.current !== null) {
        window.clearTimeout(copiedTimeoutRef.current);
      }
    };
  }, []);

  async function share() {
      try {
        if (!shareAvailable) return;
        await (navigator as ShareNavigator).share?.({ text: shareText });
      } catch {
        setCopied(false);
      }
  }

  async function copy() {
      setFallbackVisible(false);
      let copiedToClipboard = false;
      try {
        await navigator.clipboard.writeText(shareText);
        copiedToClipboard = true;
      } catch {
          setFallbackVisible(true);
          setCopied(false);
          textareaRef.current?.focus();
          textareaRef.current?.select();
        }
        if (copiedToClipboard) setCopied(true);
    if (copiedTimeoutRef.current !== null) {
      window.clearTimeout(copiedTimeoutRef.current);
    }
    copiedTimeoutRef.current = window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="mt-6 w-full">
      <p className="font-display text-lg font-extrabold">শেয়ার করো</p>
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {shareAvailable && (
          <button
            type="button"
            onClick={() => void share()}
            className="min-h-11 rounded-full border-2 border-night bg-hotpink px-4 font-display font-bold text-night focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-night"
          >
            শেয়ার করো
          </button>
        )}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 items-center rounded-full border-2 border-night bg-parrot px-4 font-display font-bold focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-night"
        >
          WhatsApp
        </a>
        <a
          href={facebookUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 items-center rounded-full border-2 border-night bg-teal px-4 font-display font-bold text-white focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-night"
        >
          Facebook
        </a>
        <button
          type="button"
          onClick={() => void copy()}
          className="min-h-11 rounded-full border-2 border-night bg-paper px-4 font-display font-bold focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-night"
        >
          {copied ? "কপি হয়েছে" : "কপি করো"}
        </button>
      </div>
      <textarea
        ref={textareaRef}
        readOnly
        value={shareText}
        aria-label="শেয়ার করার লেখা"
        className={`mt-3 min-h-20 w-full rounded-lg border-2 border-night bg-white/70 p-2 text-sm ${
          fallbackVisible ? "block" : "sr-only"
        }`}
      />
    </div>
  );
}
