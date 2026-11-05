const BARS = ["#c0c0c0", "#c0c000", "#00c0c0", "#00c000", "#c000c0", "#c00000", "#0000c0"];

export default function ColorBars() {
  return (
    <div className="flex h-full w-full">
      {BARS.map((c) => (
        <div key={c} className="h-full flex-1" style={{ background: c }} />
      ))}
    </div>
  );
}
