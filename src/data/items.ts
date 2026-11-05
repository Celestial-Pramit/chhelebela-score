export type Era = "90s" | "2000s" | "both";
export type Setting = "city" | "village" | "both";

export type ChannelId =
  | "tv"
  | "outdoor"
  | "indoor-cricket"
  | "food"
  | "music-festival"
  | "books-school"
  | "tech";

export type Channel = {
  id: ChannelId;
  n: number;
  name: string;
  short: string;
};

export type Item = {
  id: string;
  /** Permanent, globally unique. Never renumber or reuse - used by URL bitmasks. */
  n: number;
  channel: ChannelId;
  text: string;
  era: Era;
  eraNeutral?: boolean;
  setting: Setting;
  needsPoll: boolean;
};

export const CHANNELS: readonly Channel[] = [
  { id: "tv", n: 1, name: "টিভি", short: "টিভি" },
  { id: "outdoor", n: 2, name: "পাড়ার খেলা", short: "পাড়ার খেলা" },
  { id: "indoor-cricket", n: 3, name: "ঘর ও ক্রিকেট", short: "ঘর ও ক্রিকেট" },
  { id: "food", n: 4, name: "খাবার ও মেলা", short: "খাবার ও মেলা" },
  { id: "music-festival", n: 5, name: "গান ও উৎসব", short: "গান ও উৎসব" },
  { id: "books-school", n: 6, name: "বই ও স্কুল", short: "বই ও স্কুল" },
  { id: "tech", n: 7, name: "টেক ও গেমিং", short: "টেক ও গেমিং" },
] as const;

const CHANNEL_IDS: ReadonlySet<string> = new Set(CHANNELS.map((c) => c.id));

export function isChannelId(value: unknown): value is ChannelId {
  return typeof value === "string" && CHANNEL_IDS.has(value);
}

export const ITEMS: readonly Item[] = [
  // টিভি
  {
    id: "tv-only-btv",
    n: 1,
    channel: "tv",
    text: "শুধু বিটিভিই দেখতাম",
    era: "90s",
    setting: "both",
    needsPoll: false,
  },
  {
    id: "tv-empty-streets",
    n: 2,
    channel: "tv",
    text: "প্রিয় নাটকের সময় বাইরে যেতাম না",
    era: "90s",
    setting: "both",
    needsPoll: false,
  },
  {
    id: "tv-btv-drama",
    n: 3,
    channel: "tv",
    text: "বিটিভির নাটক (কোথাও কেউ নেই, বহুব্রীহি, নক্ষত্রের রাত) দেখেছি",
    era: "90s",
    setting: "both",
    needsPoll: true,
  },
  {
    id: "tv-neighbour-tv",
    n: 4,
    channel: "tv",
    text: "প্রতিবেশী বা আত্মীয়ের বাসায় গিয়ে টিভি দেখেছি",
    era: "both",
    setting: "both",
    needsPoll: false,
  },
  {
    id: "tv-family-ityadi",
    n: 5,
    channel: "tv",
    text: "পরিবারের সবাই মিলে ইত্যাদি দেখতাম",
    era: "both",
    setting: "both",
    needsPoll: false,
  },
  {
    id: "tv-eid-kids-show",
    n: 6,
    channel: "tv",
    text: "ঈদে টিভির বিশেষ শিশু অনুষ্ঠান দেখেছি",
    era: "both",
    setting: "both",
    needsPoll: false,
  },
  {
    id: "tv-meena",
    n: 7,
    channel: "tv",
    text: "মীনা কার্টুন দেখেছি",
    era: "both",
    setting: "both",
    needsPoll: false,
  },
  {
    id: "tv-sisimpur",
    n: 8,
    channel: "tv",
    text: "সিসিমপুর দেখেছি",
    era: "2000s",
    setting: "both",
    needsPoll: false,
  },
  {
    id: "tv-sat-cats",
    n: 9,
    channel: "tv",
    text: "স্যাট ক্যাটসের মতো বিদেশি কার্টুন দেখেছি",
    era: "90s",
    setting: "both",
    needsPoll: false,
  },
  {
    id: "tv-cartoon-network",
    n: 10,
    channel: "tv",
    text: "কার্টুন নেটওয়ার্ক দেখেছি",
    era: "2000s",
    setting: "city",
    needsPoll: false,
  },
  {
    id: "tv-antenna",
    n: 11,
    channel: "tv",
    text: "ছাদে অ্যান্টেনা বা বুস্টার ঠিক করে টিভি দেখেছি",
    era: "both",
    setting: "both",
    needsPoll: false,
  },
  {
    id: "tv-notun-kuri",
    n: 12,
    channel: "tv",
    text: "প্রতিবেশীদের সাথে জড়ো হয়ে নতুন কুঁড়ি দেখেছি",
    era: "2000s",
    setting: "both",
    needsPoll: false,
  },

  // পাড়ার খেলা
  {
    id: "outdoor-gollachut",
    n: 13,
    channel: "outdoor",
    text: "গোল্লাছুট খেলতাম",
    era: "both",
    setting: "both",
    needsPoll: false,
  },
  {
    id: "outdoor-bouchi",
    n: 14,
    channel: "outdoor",
    text: "বউচি খেলতাম",
    era: "both",
    setting: "both",
    needsPoll: false,
  },
  {
    id: "outdoor-borof-pani",
    n: 15,
    channel: "outdoor",
    text: "বরফ-পানি খেলতাম",
    era: "both",
    setting: "both",
    needsPoll: false,
  },
  {
    id: "outdoor-dariabandha",
    n: 16,
    channel: "outdoor",
    text: "দাড়িয়াবান্ধা খেলতাম",
    era: "both",
    setting: "both",
    needsPoll: false,
  },
  {
    id: "outdoor-phul-toka",
    n: 17,
    channel: "outdoor",
    text: "ফুল টোকা খেলতাম",
    era: "both",
    setting: "both",
    needsPoll: false,
  },
  {
    id: "outdoor-chhoa-chhui",
    n: 18,
    channel: "outdoor",
    text: "ছোঁয়াছুঁয়ি খেলতাম",
    era: "both",
    setting: "both",
    needsPoll: true,
  },
  {
    id: "outdoor-marbles",
    n: 19,
    channel: "outdoor",
    text: "মার্বেল (কাঞ্চা/গুলি) খেলতাম",
    era: "both",
    setting: "both",
    needsPoll: false,
  },
  {
    id: "outdoor-sat-chara",
    n: 20,
    channel: "outdoor",
    text: "সাতচারা (পিঠু) খেলতাম",
    era: "both",
    setting: "both",
    needsPoll: true,
  },
  {
    id: "outdoor-kho-kho",
    n: 21,
    channel: "outdoor",
    text: "খো-খো খেলতাম",
    era: "both",
    setting: "both",
    needsPoll: false,
  },
  {
    id: "outdoor-kite",
    n: 22,
    channel: "outdoor",
    text: "ঘুড়ি ওড়াতাম",
    era: "both",
    setting: "both",
    needsPoll: true,
  },
  {
    id: "outdoor-rain-football",
    n: 23,
    channel: "outdoor",
    text: "বৃষ্টিতে ফুটবল খেলতাম",
    era: "both",
    setting: "both",
    needsPoll: true,
  },
  {
    id: "outdoor-loadshedding-hide-seek",
    n: 24,
    channel: "outdoor",
    text: "লোডশেডিংয়ের অন্ধকারে লুকোচুরি খেলতাম",
    era: "2000s",
    setting: "both",
    needsPoll: false,
  },

  // ঘর ও ক্রিকেট
  {
    id: "indoor-ludo",
    n: 25,
    channel: "indoor-cricket",
    text: "লুডু খেলতাম",
    era: "both",
    setting: "both",
    needsPoll: false,
  },
  {
    id: "indoor-snake-ludo",
    n: 26,
    channel: "indoor-cricket",
    text: "সাপলুডু খেলতাম",
    era: "both",
    setting: "both",
    needsPoll: false,
  },
  {
    id: "indoor-carrom",
    n: 27,
    channel: "indoor-cricket",
    text: "ক্যারম খেলতাম",
    era: "both",
    setting: "both",
    needsPoll: false,
  },
  {
    id: "indoor-lattim",
    n: 28,
    channel: "indoor-cricket",
    text: "লাটিম ঘুরাতাম",
    era: "both",
    setting: "both",
    needsPoll: false,
  },
  {
    id: "indoor-alley-badminton",
    n: 29,
    channel: "indoor-cricket",
    text: "গলিতে ব্যাডমিন্টন খেলতাম",
    era: "both",
    setting: "both",
    needsPoll: false,
  },
  {
    id: "indoor-tennis-cricket",
    n: 30,
    channel: "indoor-cricket",
    text: "টেনিস বলে ক্রিকেট খেলতাম",
    era: "both",
    setting: "both",
    needsPoll: true,
  },
  {
    id: "indoor-1997-icc",
    n: 31,
    channel: "indoor-cricket",
    text: "১৯৯৭ আইসিসি ট্রফি জয়ের কথা মনে আছে বা পরিবারের কাছে শুনেছি",
    era: "90s",
    eraNeutral: true,
    setting: "both",
    needsPoll: false,
  },
  {
    id: "indoor-1999-world-cup",
    n: 32,
    channel: "indoor-cricket",
    text: "১৯৯৯ বিশ্বকাপে পাকিস্তানকে হারানোর দিন মনে আছে বা শুনেছি",
    era: "90s",
    eraNeutral: true,
    setting: "both",
    needsPoll: false,
  },

  // খাবার ও মেলা
  {
    id: "food-kodma",
    n: 33,
    channel: "food",
    text: "মিষ্টির দোকানে কদমা খেতাম",
    era: "both",
    setting: "both",
    needsPoll: false,
  },
  {
    id: "food-mimi",
    n: 34,
    channel: "food",
    text: "মিমি চকোলেট খেতাম",
    era: "90s",
    setting: "both",
    needsPoll: true,
  },
  {
    id: "food-bottle-exchange",
    n: 35,
    channel: "food",
    text: "প্লাস্টিকের বোতল জমিয়ে ফেরিওয়ালার কাছে মিষ্টির বদলে দিতাম",
    era: "both",
    setting: "both",
    needsPoll: true,
  },
  {
    id: "food-boishakhi-mela",
    n: 36,
    channel: "food",
    text: "বৈশাখী মেলায় মণ্ডা বা মেলার খাবার খেতাম",
    era: "both",
    setting: "both",
    needsPoll: false,
  },
  {
    id: "food-fuchka",
    n: 37,
    channel: "food",
    text: "ফুচকা-চটপটি খেতাম",
    era: "both",
    setting: "both",
    needsPoll: true,
  },
  {
    id: "food-ice-cream",
    n: 38,
    channel: "food",
    text: "আইসক্রিমওয়ালার ডাক শুনে দৌড়ে যেতাম",
    era: "both",
    setting: "both",
    needsPoll: true,
  },
  {
    id: "food-school-gate-achar",
    n: 39,
    channel: "food",
    text: "স্কুলের গেটে আচার বা তেঁতুল কিনে খেতাম",
    era: "both",
    setting: "both",
    needsPoll: true,
  },
  {
    id: "food-tiffin",
    n: 40,
    channel: "food",
    text: "টিফিন বক্সে খাবার নিয়ে স্কুলে যেতাম",
    era: "both",
    setting: "both",
    needsPoll: false,
  },

  // গান ও উৎসব
  {
    id: "music-cassette-player",
    n: 41,
    channel: "music-festival",
    text: "বাসায় ক্যাসেট প্লেয়ার ছিল",
    era: "90s",
    setting: "both",
    needsPoll: false,
  },
  {
    id: "music-cassette-ribbon",
    n: 42,
    channel: "music-festival",
    text: "পেনসিল দিয়ে ক্যাসেটের ফিতা গুটিয়েছি",
    era: "90s",
    setting: "both",
    needsPoll: false,
  },
  {
    id: "music-cassette-shop",
    n: 43,
    channel: "music-festival",
    text: "ক্যাসেট বা সিডির দোকানে গিয়েছি",
    era: "both",
    setting: "both",
    needsPoll: false,
  },
  {
    id: "music-cd",
    n: 44,
    channel: "music-festival",
    text: "সিডিতে গান শুনেছি",
    era: "2000s",
    setting: "both",
    needsPoll: false,
  },
  {
    id: "music-eid-card",
    n: 45,
    channel: "music-festival",
    text: "ঈদ কার্ড কিনেছি, পেয়েছি বা পাঠিয়েছি",
    era: "both",
    setting: "both",
    needsPoll: false,
  },
  {
    id: "music-eid-mic",
    n: 46,
    channel: "music-festival",
    text: "ঈদের আগে মাইকে নতুন গান বাজতে শুনেছি",
    era: "both",
    setting: "both",
    needsPoll: false,
  },
  {
    id: "music-eid-stall",
    n: 47,
    channel: "music-festival",
    text: "ঈদে ক্যাসেট বা সিডির স্টলে ভিড় দেখেছি",
    era: "both",
    setting: "both",
    needsPoll: false,
  },
  {
    id: "music-pohela-boishakh",
    n: 48,
    channel: "music-festival",
    text: "পহেলা বৈশাখে গান-বাজনার অনুষ্ঠান দেখেছি বা শুনেছি",
    era: "both",
    setting: "both",
    needsPoll: true,
  },
  {
    id: "music-puja-mondop",
    n: 49,
    channel: "music-festival",
    text: "পূজার সময় মণ্ডপে ঘুরেছি",
    era: "both",
    setting: "both",
    needsPoll: true,
  },
  {
    id: "music-school-program",
    n: 67,
    channel: "music-festival",
    text: "স্কুলের সাংস্কৃতিক অনুষ্ঠানে গান বা কবিতা করেছি",
    era: "both",
    setting: "both",
    needsPoll: false,
  },

  // বই ও স্কুল
  {
    id: "books-tin-goyenda",
    n: 50,
    channel: "books-school",
    text: "তিন গোয়েন্দা পড়েছি",
    era: "both",
    setting: "both",
    needsPoll: false,
  },
  {
    id: "books-seba",
    n: 51,
    channel: "books-school",
    text: "সেবা প্রকাশনীর অন্য কোনো সিরিজ পড়েছি",
    era: "both",
    setting: "both",
    needsPoll: true,
  },
  {
    id: "books-comics",
    n: 52,
    channel: "books-school",
    text: "কমিক্স বা গল্পের বই পড়েছি",
    era: "both",
    setting: "both",
    needsPoll: true,
  },
  {
    id: "books-eid-magazine",
    n: 53,
    channel: "books-school",
    text: "ঈদ সংখ্যা বা বিশেষ ম্যাগাজিন পড়েছি",
    era: "both",
    setting: "both",
    needsPoll: true,
  },
  {
    id: "books-public-library",
    n: 54,
    channel: "books-school",
    text: "পাবলিক লাইব্রেরিতে গিয়েছি",
    era: "both",
    setting: "both",
    needsPoll: true,
  },
  {
    id: "books-tin-shed-class",
    n: 55,
    channel: "books-school",
    text: "টিনের চালার ঘরে ক্লাস করেছি",
    era: "both",
    setting: "village",
    needsPoll: true,
  },
  {
    id: "books-coaching",
    n: 56,
    channel: "books-school",
    text: "কোচিং সেন্টার বা প্রাইভেট টিউটরের কাছে পড়েছি",
    era: "both",
    setting: "both",
    needsPoll: false,
  },
  {
    id: "books-sports-day",
    n: 57,
    channel: "books-school",
    text: "স্কুলের ক্রীড়া প্রতিযোগিতায় অংশ নিয়েছি",
    era: "both",
    setting: "both",
    needsPoll: true,
  },
  {
    id: "books-result-day",
    n: 58,
    channel: "books-school",
    text: "পরীক্ষার ফলের দিনের অপেক্ষা মনে আছে",
    era: "both",
    setting: "both",
    needsPoll: true,
  },

  // টেক ও গেমিং
  {
    id: "tech-gta-vice-city",
    n: 59,
    channel: "tech",
    text: "বাংলা ডাবিং জিটিএ ভাইস সিটি দেখেছি বা খেলেছি",
    era: "2000s",
    setting: "both",
    needsPoll: false,
  },
  {
    id: "tech-gaming-shop",
    n: 60,
    channel: "tech",
    text: "গেমিং শপ বা সাইবার ক্যাফেতে গেম খেলেছি",
    era: "2000s",
    setting: "both",
    needsPoll: false,
  },
  {
    id: "tech-nfs",
    n: 61,
    channel: "tech",
    text: "নিড ফর স্পিড মোস্ট ওয়ান্টেড খেলেছি",
    era: "2000s",
    setting: "both",
    needsPoll: false,
  },
  {
    id: "tech-igi",
    n: 62,
    channel: "tech",
    text: "আইজিআই খেলেছি",
    era: "2000s",
    setting: "both",
    needsPoll: false,
  },
  {
    id: "tech-call-of-duty",
    n: 63,
    channel: "tech",
    text: "কল অব ডিউটি খেলেছি",
    era: "2000s",
    setting: "both",
    needsPoll: false,
  },
  {
    id: "tech-arcade",
    n: 64,
    channel: "tech",
    text: "আর্কেড মেশিনে খেলেছি",
    era: "both",
    setting: "city",
    needsPoll: false,
  },
  {
    id: "tech-nokia-1100",
    n: 65,
    channel: "tech",
    text: "নোকিয়া ১১০০ ফোন ব্যবহার করেছি বা দেখেছি",
    era: "2000s",
    setting: "both",
    needsPoll: false,
  },
  {
    id: "tech-snake",
    n: 66,
    channel: "tech",
    text: "মোবাইলে স্নেক গেম খেলেছি",
    era: "2000s",
    setting: "both",
    needsPoll: true,
  },
] as const;

const ITEM_BY_ID = new Map(ITEMS.map((item) => [item.id, item]));

export function itemsByChannel(channelId: ChannelId): Item[] {
  return ITEMS.filter((item) => item.channel === channelId);
}

export function getItem(id: string): Item | undefined {
  return ITEM_BY_ID.get(id);
}

function assertItemIntegrity(items: readonly Item[]): void {
  if (process.env.NODE_ENV === "production") return;

  const ids = new Set<string>();
  const numbers = new Set<number>();

  for (const item of items) {
    if (ids.has(item.id)) throw new Error(`[items] duplicate id: ${item.id}`);
    if (numbers.has(item.n)) throw new Error(`[items] duplicate n: ${item.n}`);
    if (!isChannelId(item.channel)) {
      throw new Error(`[items] unknown channel: ${String(item.channel)}`);
    }
    ids.add(item.id);
    numbers.add(item.n);
  }
}

assertItemIntegrity(ITEMS);
