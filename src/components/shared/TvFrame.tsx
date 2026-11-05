"use client";

import { motion } from "motion/react";
import { useState, type ReactNode } from "react";
import { KNOB_LABEL } from "@/lib/copy";

const BALOO = { fontFamily: "var(--font-baloo), sans-serif" } as const;

/* ---------- Clickable knob (HTML over the SVG wells) ---------- */
function Knob({
  label,
  className,
  onClick,
  interactive = true,
  reducedMotion = false,
}: {
  label: string;
  className: string;
  onClick?: () => void;
  interactive?: boolean;
  reducedMotion?: boolean;
}) {
  const [turn, setTurn] = useState(0);
  const knob = (
      <span className="block h-full w-full rounded-full shadow-[0_3px_0_rgba(0,0,0,0.5)]">
        <motion.span
          animate={{ rotate: turn }}
          transition={
            reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 180, damping: 11 }
          }
          className="relative block h-full w-full rounded-full border-2 border-night md:border-[3px]"
          style={{
            background: "repeating-conic-gradient(#2b2b33 0 7deg, #b5b5bd 7deg 14deg)",
          }}
        >
          <span className="absolute inset-[22%] rounded-full border-2 border-night bg-[radial-gradient(circle_at_35%_30%,#f4f4f4,#9a9aa2_60%,#4b4b55)]" />
          <span className="absolute left-1/2 top-[7%] h-[24%] w-[7%] -translate-x-1/2 rounded-full bg-marigold" />
        </motion.span>
      </span>
  );
  if (!interactive) {
    return (
      <span aria-hidden="true" className={`absolute aspect-square ${className}`}>
        {knob}
      </span>
    );
  }
  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => {
        setTurn((t) => t + 70);
        onClick?.();
      }}
      className={`absolute aspect-square rounded-full focus-visible:outline-4 focus-visible:outline-marigold ${className}`}
    >
      {knob}
    </button>
  );
}

/* ---------- Desktop artwork: side control panel (viewBox 800x640) ---------- */
function DesktopArt() {
  return (
    <svg
      viewBox="0 0 800 640"
      className="absolute inset-0 hidden h-full w-full md:block"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="d-wood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C98C4B" />
          <stop offset="0.5" stopColor="#8F5A2B" />
          <stop offset="1" stopColor="#5C3716" />
        </linearGradient>
        <linearGradient id="d-cream" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F6EDD3" />
          <stop offset="1" stopColor="#CBBE9B" />
        </linearGradient>
        <linearGradient id="d-metal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4A4A55" />
          <stop offset="1" stopColor="#1F1F27" />
        </linearGradient>
        <radialGradient id="d-glass" cx="0.35" cy="0.3" r="0.9">
          <stop offset="0" stopColor="#245450" />
          <stop offset="1" stopColor="#07130F" />
        </radialGradient>
        <filter id="d-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.004 0.22" numOctaves="3" seed="7" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.22  0 0 0 0 0.11  0 0 0 0 0.03  0 0 0 1.4 -0.35"
          />
        </filter>
        <clipPath id="d-cab">
          <rect x="20" y="78" width="760" height="440" rx="44" />
        </clipPath>
      </defs>

      {/* floor shadow */}
      <ellipse cx="400" cy="632" rx="330" ry="8" fill="#15152D" opacity="0.22" />

      {/* back legs */}
      <g fill="#4A2D12" stroke="#15152D" strokeWidth="4" strokeLinejoin="round">
        <path d="M158 520 L190 520 L172 616 L154 616 Z" />
        <path d="M642 520 L610 520 L628 616 L646 616 Z" />
      </g>
      {/* front legs (splayed) */}
      <g fill="url(#d-wood)" stroke="#15152D" strokeWidth="5" strokeLinejoin="round">
        <path d="M92 514 L148 514 L108 632 L80 632 Z" />
        <path d="M708 514 L652 514 L692 632 L720 632 Z" />
      </g>
      {/* skirt */}
      <path d="M56 510 H744 L730 540 H70 Z" fill="#4F2F14" stroke="#15152D" strokeWidth="5" strokeLinejoin="round" />

      {/* antenna rods */}
      <g stroke="#15152D" strokeWidth="6" strokeLinecap="round">
        <line x1="388" y1="86" x2="318" y2="12" />
        <line x1="412" y1="86" x2="482" y2="12" />
      </g>
      <g fill="#D4D4DC" stroke="#15152D" strokeWidth="4">
        <circle cx="318" cy="12" r="8" />
        <circle cx="482" cy="12" r="8" />
      </g>

      {/* cabinet */}
      <rect x="20" y="78" width="760" height="440" rx="44" fill="url(#d-wood)" stroke="#15152D" strokeWidth="6" />
      <g clipPath="url(#d-cab)">
        <rect x="20" y="78" width="760" height="440" filter="url(#d-grain)" opacity="0.6" />
      </g>
      <rect x="30" y="88" width="740" height="420" rx="36" fill="none" stroke="#F2C48A" strokeOpacity="0.4" strokeWidth="2.5" />
      <path d="M70 84 H730" stroke="#F7D4A2" strokeOpacity="0.6" strokeWidth="4" strokeLinecap="round" />

      {/* antenna dome */}
      <path d="M350 82 Q400 36 450 82 Z" fill="#B9B9C4" stroke="#15152D" strokeWidth="5" strokeLinejoin="round" />
      <path d="M368 76 Q400 52 432 76" fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="4" strokeLinecap="round" />

      {/* bezel + tube */}
      <rect x="52" y="110" width="500" height="376" rx="50" fill="url(#d-cream)" stroke="#15152D" strokeWidth="5" />
      <rect x="62" y="120" width="480" height="356" rx="42" fill="none" stroke="#15152D" strokeOpacity="0.16" strokeWidth="6" />
      <rect x="74" y="132" width="456" height="332" rx="58" fill="#0E100E" />
      <rect x="82" y="140" width="440" height="316" rx="52.8" ry="50.6" fill="url(#d-glass)" stroke="#15152D" strokeWidth="4" />

      {/* control panel */}
      <rect x="580" y="110" width="170" height="376" rx="24" fill="url(#d-metal)" stroke="#15152D" strokeWidth="5" />
      <g stroke="#fff" strokeOpacity="0.05" strokeWidth="2">
        {Array.from({ length: 12 }, (_, i) => (
          <line key={i} x1="590" x2="740" y1={126 + i * 30} y2={126 + i * 30} />
        ))}
      </g>
      <circle cx="718" cy="130" r="11" fill="#EF493E" opacity="0.28" />
      <circle cx="718" cy="130" r="5.5" fill="#EF493E" stroke="#15152D" strokeWidth="2" />
      {[186, 308].map((cy) => (
        <circle key={cy} cx="665" cy={cy} r="45" fill="#0C0C11" stroke="#15152D" strokeWidth="3" />
      ))}
      <g textAnchor="middle" fill="#F6EDD3" fontSize="15" fontWeight="700" style={BALOO}>
        <text x="665" y="252">চ্যানেল</text>
        <text x="665" y="374">ভলিউম</text>
      </g>
      <g stroke="#15152D" strokeWidth="2">
        <rect x="610" y="386" width="36" height="14" fill="#087E80" />
        <rect x="646" y="386" width="36" height="14" fill="#FFBE28" />
        <rect x="682" y="386" width="36" height="14" fill="#EF493E" />
      </g>
      <rect x="606" y="412" width="118" height="60" rx="8" fill="#0C0C10" stroke="#15152D" strokeWidth="3" />
      <g stroke="#8A8A96" strokeWidth="3" strokeLinecap="round">
        {Array.from({ length: 13 }, (_, i) => (
          <line key={i} x1={616 + i * 8.5} x2={616 + i * 8.5} y1="420" y2="464" />
        ))}
      </g>

      {/* brand plaque */}
      <rect x="300" y="492" width="200" height="20" rx="5" fill="#1C130A" stroke="#15152D" strokeWidth="2" />
      <text x="400" y="507" textAnchor="middle" fontSize="13" fontWeight="800" fill="#FFBE28" style={BALOO}>
        ছেলেবেলা চ্যানেল
      </text>
    </svg>
  );
}

/* ---------- Mobile artwork: controls in the chin (viewBox 400x430) ---------- */
function MobileArt() {
  return (
    <svg
      viewBox="0 0 400 430"
      className="absolute inset-0 h-full w-full md:hidden"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="m-wood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C98C4B" />
          <stop offset="0.5" stopColor="#8F5A2B" />
          <stop offset="1" stopColor="#5C3716" />
        </linearGradient>
        <linearGradient id="m-cream" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F6EDD3" />
          <stop offset="1" stopColor="#CBBE9B" />
        </linearGradient>
        <linearGradient id="m-metal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4A4A55" />
          <stop offset="1" stopColor="#1F1F27" />
        </linearGradient>
        <radialGradient id="m-glass" cx="0.35" cy="0.3" r="0.9">
          <stop offset="0" stopColor="#245450" />
          <stop offset="1" stopColor="#07130F" />
        </radialGradient>
        <filter id="m-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.004 0.22" numOctaves="3" seed="7" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.22  0 0 0 0 0.11  0 0 0 0 0.03  0 0 0 1.4 -0.35"
          />
        </filter>
        <clipPath id="m-cab">
          <rect x="10" y="52" width="380" height="330" rx="34" />
        </clipPath>
      </defs>

      <ellipse cx="200" cy="425" rx="165" ry="5" fill="#15152D" opacity="0.22" />

      {/* legs + skirt */}
      <g fill="url(#m-wood)" stroke="#15152D" strokeWidth="4" strokeLinejoin="round">
        <path d="M46 378 L90 378 L60 426 L38 426 Z" />
        <path d="M354 378 L310 378 L340 426 L362 426 Z" />
      </g>
      <path d="M28 374 H372 L362 392 H38 Z" fill="#4F2F14" stroke="#15152D" strokeWidth="4" strokeLinejoin="round" />

      {/* antenna rods */}
      <g stroke="#15152D" strokeWidth="5" strokeLinecap="round">
        <line x1="190" y1="58" x2="150" y2="10" />
        <line x1="210" y1="58" x2="250" y2="10" />
      </g>
      <g fill="#D4D4DC" stroke="#15152D" strokeWidth="3.5">
        <circle cx="150" cy="10" r="6.5" />
        <circle cx="250" cy="10" r="6.5" />
      </g>

      {/* cabinet */}
      <rect x="10" y="52" width="380" height="330" rx="34" fill="url(#m-wood)" stroke="#15152D" strokeWidth="5" />
      <g clipPath="url(#m-cab)">
        <rect x="10" y="52" width="380" height="330" filter="url(#m-grain)" opacity="0.6" />
      </g>
      <rect x="18" y="60" width="364" height="314" rx="28" fill="none" stroke="#F2C48A" strokeOpacity="0.4" strokeWidth="2" />
      <path d="M40 57 H360" stroke="#F7D4A2" strokeOpacity="0.6" strokeWidth="3" strokeLinecap="round" />

      {/* dome */}
      <path d="M176 56 Q200 26 224 56 Z" fill="#B9B9C4" stroke="#15152D" strokeWidth="4" strokeLinejoin="round" />
      <path d="M185 52 Q200 38 215 52" fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="3" strokeLinecap="round" />

      {/* bezel + tube */}
      <rect x="26" y="68" width="348" height="244" rx="34" fill="url(#m-cream)" stroke="#15152D" strokeWidth="4" />
      <rect x="34" y="76" width="332" height="228" rx="28" fill="none" stroke="#15152D" strokeOpacity="0.16" strokeWidth="5" />
      <rect x="38" y="80" width="324" height="216" rx="40" fill="#0E100E" />
      <rect x="44" y="86" width="312" height="204" rx="37.4" ry="32.6" fill="url(#m-glass)" stroke="#15152D" strokeWidth="3" />

      {/* chin: controls */}
      <rect x="26" y="322" width="348" height="50" rx="14" fill="url(#m-metal)" stroke="#15152D" strokeWidth="4" />
      {[62, 118].map((cx) => (
        <circle key={cx} cx={cx} cy="347" r="27" fill="#0C0C11" stroke="#15152D" strokeWidth="2.5" />
      ))}
      <g stroke="#15152D" strokeWidth="2">
        <rect x="150" y="341" width="20" height="12" fill="#087E80" />
        <rect x="172" y="341" width="20" height="12" fill="#FFBE28" />
        <rect x="194" y="341" width="20" height="12" fill="#EF493E" />
      </g>
      <circle cx="224" cy="347" r="8" fill="#EF493E" opacity="0.28" />
      <circle cx="224" cy="347" r="4.5" fill="#EF493E" stroke="#15152D" strokeWidth="1.5" />
      <rect x="238" y="330" width="120" height="34" rx="6" fill="#0C0C10" stroke="#15152D" strokeWidth="2.5" />
      <g stroke="#8A8A96" strokeWidth="2.5" strokeLinecap="round">
        {Array.from({ length: 15 }, (_, i) => (
          <line key={i} x1={246 + i * 7.2} x2={246 + i * 7.2} y1="336" y2="358" />
        ))}
      </g>
    </svg>
  );
}

/* ---------- Public component ---------- */
export default function TvFrame({
  children,
  channel = "০১",
  delay = 1,
  onChannelKnob,
  screenKey,
  reducedMotion = false,
}: {
  children: ReactNode;
  channel?: string;
  delay?: number;
  onChannelKnob?: () => void;
  screenKey?: string;
  reducedMotion?: boolean;
}) {
  return (
    <div className="relative aspect-[400/430] w-full md:aspect-[800/640]">
      <MobileArt />
      <DesktopArt />

      {/* Screen: HTML over the SVG glass */}
      <div className="absolute left-[11%] top-[20%] h-[47.44%] w-[78%] overflow-hidden rounded-[12%/16%] md:left-[10.25%] md:top-[21.875%] md:h-[49.375%] md:w-[55%]">
        <motion.div
          key={screenKey}
          className="absolute inset-0"
          initial={reducedMotion ? false : { scaleY: 0.01, scaleX: 0.7, filter: "brightness(4)" }}
          animate={{ scaleY: 1, scaleX: 1, filter: "brightness(1)" }}
          transition={
            reducedMotion
              ? { duration: 0 }
              : { delay, duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }
          }
        >
          {children}
          <span className="absolute left-[7%] top-[6%] z-10 font-display text-xs font-extrabold text-parrot [text-shadow:0_0_6px_rgba(25,182,91,0.9)] sm:text-base">
            চ্যানেল {channel}
          </span>
        </motion.div>
        <div className="tv-scan" aria-hidden="true" />
        <div className="tv-glare" aria-hidden="true" />
      </div>

      {/* Knobs: chin on mobile, side panel on desktop */}
      <Knob
        label={KNOB_LABEL(channel)}
        className="left-[10%] top-[75.58%] w-[11%] md:left-[78.375%] md:top-[23.125%] md:w-[9.5%]"
        onClick={onChannelKnob}
        reducedMotion={reducedMotion}
      />
      <Knob
        label="ভলিউম"
        className="left-[24%] top-[75.58%] w-[11%] md:left-[78.375%] md:top-[42.1875%] md:w-[9.5%]"
        interactive={false}
        reducedMotion={reducedMotion}
      />
    </div>
  );
}
