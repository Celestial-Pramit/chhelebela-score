"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { ReactNode } from "react";

const tones = {
  pink: "bg-hotpink text-white",
  green: "bg-parrot text-night",
  yellow: "bg-marigold text-night",
  teal: "bg-teal text-white",
} as const;

type Props = {
  children: ReactNode;
  tone?: keyof typeof tones;
  onClick?: () => void;
  href?: string;
  className?: string;
};

export default function StickerButton({
  children,
  tone = "pink",
  onClick,
  href,
  className = "",
}: Props) {
  const face = (
    <motion.span
      whileHover={{ rotate: -2, scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95, x: 4, y: 4 }}
      className={`inline-flex items-center gap-3 rounded-full border-4 border-night px-7 py-3.5 font-display text-xl font-extrabold shadow-[6px_6px_0_#15152d] sm:px-9 sm:py-4 sm:text-2xl ${tones[tone]} ${className}`}
    >
      {children}
    </motion.span>
  );

  const focus =
    "inline-block rounded-full focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-night";

  if (href) {
    return (
      <Link href={href} className={focus}>
        {face}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={focus}>
      {face}
    </button>
  );
}
