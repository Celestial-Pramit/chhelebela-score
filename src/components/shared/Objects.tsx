"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/* Floating die-cut sticker */
export function Sticker({
  children,
  className = "",
  rotate = 0,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  rotate?: number;
  delay?: number;
}) {
  return (
    <motion.div
      className={`sticker-cut ${className}`}
      initial={{ opacity: 0, scale: 0.6, rotate: rotate - 14 }}
      animate={{ opacity: 1, scale: 1, rotate, y: [0, -5, 0] }}
      transition={{
        opacity: { delay, duration: 0.4 },
        scale: { delay, type: "spring", stiffness: 180, damping: 14 },
        rotate: { delay, type: "spring", stiffness: 120, damping: 12 },
        y: { delay: delay + 0.8, duration: 6, repeat: Infinity, ease: "easeInOut" },
      }}
    >
      {children}
    </motion.div>
  );
}

/* Cassette */
export function Cassette({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 156" className={className} aria-hidden="true">
      <rect x="4" y="4" width="232" height="148" rx="12" fill="#087E80" stroke="#15152D" strokeWidth="4" />
      <rect x="22" y="14" width="196" height="84" rx="6" fill="#FFF1D6" stroke="#15152D" strokeWidth="3" />
      <g stroke="#15152D" strokeOpacity="0.35" strokeWidth="2">
        <line x1="34" y1="26" x2="206" y2="26" />
        <line x1="34" y1="34" x2="206" y2="34" />
      </g>
      <rect x="23.5" y="42" width="193" height="14" fill="#FF3478" />
      <rect x="23.5" y="56" width="193" height="8" fill="#FFBE28" />
      <line x1="30" y1="49" x2="210" y2="49" stroke="#FFF1D6" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="2 8" />
      <rect x="68" y="48" width="104" height="42" rx="21" fill="#15152D" />
      <circle cx="96" cy="69" r="14" fill="#FFF1D6" stroke="#15152D" strokeWidth="3" />
      <circle cx="144" cy="69" r="14" fill="#FFF1D6" stroke="#15152D" strokeWidth="3" />
      <circle cx="96" cy="69" r="5" fill="#15152D" />
      <circle cx="144" cy="69" r="5" fill="#15152D" />
      <path d="M48 152 L62 112 H178 L192 152 Z" fill="#065E60" stroke="#15152D" strokeWidth="3" strokeLinejoin="round" />
      <circle cx="84" cy="134" r="5" fill="#FFF1D6" stroke="#15152D" strokeWidth="2" />
      <circle cx="156" cy="134" r="5" fill="#FFF1D6" stroke="#15152D" strokeWidth="2" />
      <circle cx="120" cy="124" r="4" fill="#FFF1D6" stroke="#15152D" strokeWidth="2" />
      {[
        [16, 16],
        [224, 16],
        [16, 140],
        [224, 140],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="4" fill="#FFBE28" stroke="#15152D" strokeWidth="2" />
      ))}
    </svg>
  );
}

/* Eid greeting card */
export function EidCard({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 170 220" className={className} aria-hidden="true">
      <rect x="6" y="6" width="158" height="208" rx="10" fill="#FFF1D6" stroke="#15152D" strokeWidth="4" />
      <rect x="16" y="16" width="138" height="188" rx="6" fill="#15152D" />
      <rect x="22" y="22" width="126" height="176" rx="4" fill="none" stroke="#FFBE28" strokeWidth="1.8" strokeDasharray="3 4" />
      <circle cx="85" cy="68" r="26" fill="#FFBE28" />
      <circle cx="95" cy="62" r="22" fill="#15152D" />
      <polygon
        points="102,58 104,63.25 109.6,63.5 105.2,67.05 106.7,72.5 102,69.4 97.3,72.5 98.8,67.05 94.4,63.5 100,63.25"
        fill="#FFBE28"
      />
      <g style={{ fontFamily: "var(--font-baloo), sans-serif" }} textAnchor="middle" fill="#FFF1D6" fontWeight="800">
        <text x="85" y="130" fontSize="30">ঈদ</text>
        <text x="85" y="162" fontSize="30">মোবারক</text>
      </g>
      <text x="85" y="184" textAnchor="middle" fontSize="9" letterSpacing="3" fill="#FFBE28" fontWeight="700">
        EID MUBARAK
      </text>
      {[
        [34, 34],
        [136, 34],
        [34, 186],
        [136, 186],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r="6" fill="#FF3478" />
          <circle cx={x} cy={y} r="2.2" fill="#FFBE28" />
        </g>
      ))}
    </svg>
  );
}

/* Kancha / glass marbles */
export function Marbles({ className = "" }: { className?: string }) {
  const m = [
    { cx: 36, cy: 52, r: 20, a: "#D9C8FF", b: "#7A5BD0" },
    { cx: 166, cy: 56, r: 20, a: "#9BE9B0", b: "#19B65B" },
    { cx: 104, cy: 44, r: 26, a: "#FFE9A0", b: "#E59A00" },
    { cx: 70, cy: 98, r: 36, a: "#8FE8E0", b: "#087E80" },
    { cx: 136, cy: 104, r: 30, a: "#FF9AB8", b: "#FF3478" },
  ];
  return (
    <svg viewBox="0 0 200 142" className={className} aria-hidden="true">
      <defs>
        {m.map((k, i) => (
          <radialGradient key={i} id={`mb-${i}`} cx="0.35" cy="0.3" r="0.8">
            <stop offset="0" stopColor={k.a} />
            <stop offset="1" stopColor={k.b} />
          </radialGradient>
        ))}
      </defs>
      {m.map((k, i) => (
        <g key={i}>
          <circle cx={k.cx} cy={k.cy} r={k.r} fill={`url(#mb-${i})`} stroke="#15152D" strokeWidth="4" />
          {[0, 60, 120].map((deg) => (
            <path
              key={deg}
              d={`M${k.cx} ${k.cy - k.r * 0.62} Q${k.cx + k.r * 0.34} ${k.cy} ${k.cx} ${k.cy + k.r * 0.62} Q${k.cx - k.r * 0.34} ${k.cy} ${k.cx} ${k.cy - k.r * 0.62} Z`}
              transform={`rotate(${deg} ${k.cx} ${k.cy})`}
              fill="#FFF1D6"
              opacity="0.75"
            />
          ))}
          <ellipse
            cx={k.cx - k.r * 0.4}
            cy={k.cy - k.r * 0.42}
            rx={k.r * 0.2}
            ry={k.r * 0.11}
            transform={`rotate(-35 ${k.cx - k.r * 0.4} ${k.cy - k.r * 0.42})`}
            fill="#fff"
            opacity="0.9"
          />
        </g>
      ))}
    </svg>
  );
}
