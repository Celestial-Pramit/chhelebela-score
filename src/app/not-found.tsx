import Link from "next/link";

export default function NotFound() {
  return (
    <main className="paper flex min-h-screen items-center justify-center px-4 py-8 text-center">
      <section className="max-w-lg -rotate-1 rounded-xl border-4 border-night bg-paper p-8 shadow-[8px_8px_0_#15152d]">
        <p className="font-display text-sm font-extrabold tracking-[0.18em]">ছেলেবেলা চ্যানেল</p>
        <h1 className="mt-3 font-display text-5xl font-extrabold">এই পাতা পাওয়া যায়নি</h1>
        <p className="mt-3 font-semibold">চলো ছেলেবেলার মূল পাতায় ফিরে যাই।</p>
        <Link
          href="/"
          className="mt-6 inline-flex min-h-11 items-center rounded-full border-2 border-night bg-marigold px-5 font-display font-bold shadow-[3px_3px_0_#15152d] focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-night"
        >
          মূল পাতায় ফিরে যাও
        </Link>
      </section>
    </main>
  );
}
