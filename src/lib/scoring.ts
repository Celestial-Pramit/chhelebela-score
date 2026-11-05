import { CHANNELS, ITEMS, type ChannelId } from "../data/items";

export type Answer = "yes" | "skip";
export type Answers = Record<string, Answer | undefined>;

export type TitleBand = {
  /** Lowest overall percentage that belongs to this band. */
  min: number;
  name: string;
  description: string;
};

export type ChannelBreakdown = {
  channel: ChannelId;
  name: string;
  short: string;
  yes: number;
  eligible: number;
  percent: number | null;
};

export type ScoreResult = {
  overall: number | null;
  yes: number;
  eligible: number;
  pct90: number | null;
  pct2000: number | null;
  eraLabel: string | null;
  title: TitleBand | null;
  channels: ChannelBreakdown[];
};

export const DISCLAIMER = "এটা শুধুই মজার স্কোর - কোনো বৈজ্ঞানিক পরীক্ষা নয়।";

export const MIN_CHANNELS_FOR_RESULT = 3;
export const ERA_GAP = 12;
export const MIN_ERA_ITEMS = 6;

export const ERA_LABEL_90S = "৯০-এর দশকের সন্তান";
export const ERA_LABEL_2000S = "২০০০-এর দশকের সন্তান";
export const ERA_LABEL_BOTH = "দুই দশকের সন্তান";

export const TITLE_BANDS: readonly TitleBand[] = [
  {
    min: 80,
    name: "ছেলেবেলার জীবন্ত জাদুঘর",
    description: "তোমার ছেলেবেলার প্রায় সব স্মৃতিই এখনো ঝকঝকে হয়ে আছে!",
  },
  {
    min: 60,
    name: "পাড়ার নস্টালজিয়া ক্যাপ্টেন",
    description: "অনেক মজার স্মৃতি তোমার মনে আছে, পাড়ার সেরাদের একজন তুমি!",
  },
  {
    min: 40,
    name: "স্মৃতির ঝুলি ভরছে",
    description: "স্মৃতির ঝুলি ভরছে, আরও কিছু পুরোনো দিন খুঁজে দেখো!",
  },
  {
    min: 20,
    name: "নতুন যুগের স্মৃতি-সন্ধানী",
    description: "তুমি নতুন যুগের স্মৃতি-সন্ধানী, পুরোনো দিনের গল্পগুলো এখনো বাকি!",
  },
  {
    min: 0,
    name: "ছেলেবেলার নবীন অভিযাত্রী",
    description: "তোমার ছেলেবেলার গল্প এখনো লেখা বাকি, আজই কিছু স্মৃতি খুঁজে নাও!",
  },
] as const;

const BANGLA_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"] as const;

export function toBanglaDigits(value: number): string {
  return String(value).replace(/[0-9]/g, (digit) => BANGLA_DIGITS[Number(digit)]);
}

export function percentOf(yes: number, eligible: number): number | null {
  if (eligible <= 0) return null;
  return Math.round((100 * yes) / eligible);
}

export function getTitleBand(percent: number): TitleBand {
  return TITLE_BANDS.find((band) => percent >= band.min) ?? TITLE_BANDS[TITLE_BANDS.length - 1];
}

export function getEraLabel(pct90: number | null, pct2000: number | null): string | null {
  if (pct90 === null || pct2000 === null) return null;
  const diff = pct90 - pct2000;
  if (diff >= ERA_GAP) return ERA_LABEL_90S;
  if (diff <= -ERA_GAP) return ERA_LABEL_2000S;
  return ERA_LABEL_BOTH;
}

/** Real channel ids, de-duplicated, in display order. */
export function getDoneChannels(doneChannels: readonly string[]): ChannelId[] {
  const done = new Set(doneChannels);
  return CHANNELS.filter((channel) => done.has(channel.id)).map((channel) => channel.id);
}

export function isResultUnlocked(doneChannels: readonly string[]): boolean {
  return getDoneChannels(doneChannels).length >= MIN_CHANNELS_FOR_RESULT;
}

export function computeScore({
  answers,
  doneChannels,
}: {
  answers: Answers;
  doneChannels: readonly string[];
}): ScoreResult {
  const done = new Set(getDoneChannels(doneChannels));

  let yes = 0;
  let eligible = 0;
  let yes90 = 0;
  let eligible90 = 0;
  let yes2000 = 0;
  let eligible2000 = 0;

  const channels: ChannelBreakdown[] = CHANNELS.filter((channel) => done.has(channel.id)).map(
    (channel) => ({
      channel: channel.id,
      name: channel.name,
      short: channel.short,
      yes: 0,
      eligible: 0,
      percent: null,
    }),
  );
  const breakdownByChannel = new Map(channels.map((entry) => [entry.channel, entry]));

  for (const item of ITEMS) {
    if (!done.has(item.channel)) continue;

    const state = answers[item.id];
    if (state === "skip") continue;

    const isYes = state === "yes";
    const in90 = !item.eraNeutral && (item.era === "90s" || item.era === "both");
    const in2000 = !item.eraNeutral && (item.era === "2000s" || item.era === "both");

    eligible += 1;
    if (isYes) yes += 1;
    if (in90) {
      eligible90 += 1;
      if (isYes) yes90 += 1;
    }
    if (in2000) {
      eligible2000 += 1;
      if (isYes) yes2000 += 1;
    }

    const entry = breakdownByChannel.get(item.channel);
    if (entry) {
      entry.eligible += 1;
      if (isYes) entry.yes += 1;
    }
  }

  for (const entry of channels) {
    entry.percent = percentOf(entry.yes, entry.eligible);
  }

  const overall = percentOf(yes, eligible);
  const pct90 = eligible90 >= MIN_ERA_ITEMS ? percentOf(yes90, eligible90) : null;
  const pct2000 = eligible2000 >= MIN_ERA_ITEMS ? percentOf(yes2000, eligible2000) : null;

  return {
    overall,
    yes,
    eligible,
    pct90,
    pct2000,
    eraLabel: getEraLabel(pct90, pct2000),
    title: overall === null ? null : getTitleBand(overall),
    channels,
  };
}
