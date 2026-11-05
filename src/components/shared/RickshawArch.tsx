const ARCH = "M30 500 V240 C30 110 230 22 500 22 C770 22 970 110 970 240 V500 Z";
const INNER = "M56 466 V242 C56 128 244 50 500 50 C756 50 944 128 944 242 V466";
const GREENS = ["#19B65B", "#0F8A4A", "#7BD389", "#0B6B3A", "#3FC46E"];

/* deterministic pseudo-random: same result on server and client */
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const f = (n: number) => n.toFixed(1);

function makeLeaves() {
  const r = rng(11);
  return Array.from({ length: 95 }, (_, i) => {
    const x = 40 + r() * 920;
    const y = 80 + r() * 440;
    const a = -90 + ((x - 500) / 500) * 55 + (r() - 0.5) * 50;
    const s = 0.7 + r() * 0.9;
    const c = GREENS[Math.floor(r() * GREENS.length)];
    return { i, x, y, a, s, c };
  });
}

const LEAVES = makeLeaves();

function Bloom({
  cx,
  cy,
  r,
  outer,
  inner,
  rot = 0,
}: {
  cx: number;
  cy: number;
  r: number;
  outer: string;
  inner: string;
  rot?: number;
}) {
  const petals = Array.from({ length: 10 }, (_, i) => 36 * i + rot);
  const innerPetals = Array.from({ length: 8 }, (_, i) => 45 * i + rot + 22);
  const k = r / 70;
  return (
    <g transform={`translate(${cx} ${cy})`}>
      {petals.map((a) => (
        <g key={a} transform={`rotate(${a})`}>
          <ellipse cx={r * 0.62} cy="0" rx={r * 0.4} ry={r * 0.21} fill={outer} stroke="#15152D" strokeWidth="3" />
          {[-9, -3, 3, 9].map((t) => (
            <line
              key={t}
              x1={r}
              y1={t * k}
              x2={r * 1.16}
              y2={t * 1.6 * k}
              stroke="#FFF1D6"
              strokeWidth="3"
              strokeLinecap="round"
            />
          ))}
        </g>
      ))}
      {innerPetals.map((a) => (
        <ellipse
          key={a}
          cx={r * 0.4}
          cy="0"
          rx={r * 0.26}
          ry={r * 0.13}
          transform={`rotate(${a})`}
          fill={inner}
          stroke="#15152D"
          strokeWidth="2.5"
        />
      ))}
      <circle r={r * 0.2} fill="#FFBE28" stroke="#15152D" strokeWidth="3" />
      <circle r={r * 0.09} fill="#EF493E" />
    </g>
  );
}

const RAYS = Array.from({ length: 18 }, (_, i) => {
  const a = Math.PI * (0.08 + (0.84 * i) / 17);
  return {
    i,
    x2: (500 + 900 * Math.cos(a)).toFixed(1),
    y2: (520 - 900 * Math.sin(a)).toFixed(1),
  };
});

export function RickshawArch({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1000 500"
      preserveAspectRatio="xMidYMax slice"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="a-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0C7A70" />
          <stop offset="1" stopColor="#06403C" />
        </linearGradient>
        <clipPath id="a-clip">
          <path d={ARCH} />
        </clipPath>
        <filter id="a-paint" x="-3%" y="-3%" width="106%" height="106%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="3" result="t" />
          <feDisplacementMap in="SourceGraphic" in2="t" scale="5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <pattern id="a-petal" width="44" height="30" patternUnits="userSpaceOnUse">
          <rect width="44" height="30" fill="#EF493E" />
          <path d="M22 3 C11 8 11 22 22 27 C33 22 33 8 22 3 Z" fill="#FFF1D6" stroke="#15152D" strokeWidth="2" />
          <path d="M22 9 V21" stroke="#EF493E" strokeWidth="2" strokeLinecap="round" />
        </pattern>
      </defs>

      <path d={ARCH} fill="url(#a-bg)" />

      <g clipPath="url(#a-clip)">
        {/* soft rays */}
        <g stroke="#FFF1D6" strokeOpacity="0.1" strokeWidth="2">
          {RAYS.map((l) => (
            <line key={l.i} x1="500" y1="520" x2={l.x2} y2={l.y2} />
          ))}
        </g>

        {/* hand-painted layer */}
        <g filter="url(#a-paint)">
          {LEAVES.map((l) => (
            <g key={l.i} transform={`translate(${f(l.x)} ${f(l.y)}) rotate(${f(l.a)}) scale(${f(l.s)})`}>
              <path d="M0 0 C10 -15 38 -15 54 0 C38 15 10 15 0 0 Z" fill={l.c} />
              <path d="M6 0 H46" stroke="#B8F0C0" strokeWidth="2.2" strokeLinecap="round" opacity="0.8" />
            </g>
          ))}
          <Bloom cx={150} cy={300} r={70} outer="#F5A66B" inner="#EF493E" />
          <Bloom cx={850} cy={300} r={70} outer="#FF6B9A" inner="#FFBE28" rot={18} />
          <Bloom cx={110} cy={430} r={38} outer="#FF6B9A" inner="#FFF1D6" rot={9} />
          <Bloom cx={890} cy={425} r={38} outer="#F5A66B" inner="#FFF1D6" />
          <Bloom cx={150} cy={150} r={30} outer="#FFBE28" inner="#EF493E" rot={12} />
          <Bloom cx={850} cy={150} r={30} outer="#FFBE28" inner="#EF493E" />
        </g>

        {/* ground band */}
        <rect x="0" y="466" width="1000" height="34" fill="url(#a-petal)" />
        <rect x="0" y="464" width="1000" height="5" fill="#15152D" />
      </g>

      <path d={ARCH} fill="none" stroke="#15152D" strokeWidth="8" />
      <path d={INNER} fill="none" stroke="#FFBE28" strokeWidth="5" strokeLinecap="round" strokeDasharray="1 15" />
    </svg>
  );
}

/* Rickshaw plank trim for the page bottom */
export function PetalBand({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="100%" height="36" aria-hidden="true">
      <defs>
        <pattern id="pb-petal" width="44" height="28" patternUnits="userSpaceOnUse">
          <rect width="44" height="28" fill="#EF493E" />
          <path d="M22 3 C11 8 11 22 22 26 C33 22 33 8 22 3 Z" fill="#FFF1D6" stroke="#15152D" strokeWidth="2" />
          <path d="M22 9 V21" stroke="#EF493E" strokeWidth="2" strokeLinecap="round" />
        </pattern>
      </defs>
      <rect width="100%" height="36" fill="#15152D" />
      <rect y="4" width="100%" height="28" fill="url(#pb-petal)" />
    </svg>
  );
}
