import { describe, expect, it } from "vitest";
import { ITEMS, itemsByChannel } from "../data/items";
import {
  DISCLAIMER,
  ERA_LABEL_2000S,
  ERA_LABEL_90S,
  ERA_LABEL_BOTH,
  type Answers,
  computeScore,
  getEraLabel,
  getTitleBand,
  isResultUnlocked,
  toBanglaDigits,
} from "./scoring";

describe("computeScore", () => {
  it("gives 0% when a channel is done but nothing is ticked", () => {
    const score = computeScore({ answers: {}, doneChannels: ["tv"] });

    expect(score.overall).toBe(0);
    expect(score.yes).toBe(0);
    expect(score.eligible).toBe(itemsByChannel("tv").length);
  });

  it("returns null when no channel is done", () => {
    const score = computeScore({ answers: {}, doneChannels: [] });

    expect(score.overall).toBeNull();
    expect(score.eligible).toBe(0);
    expect(score.title).toBeNull();
  });

  it("removes skipped items from the denominator", () => {
    const items = itemsByChannel("indoor-cricket");
    const answers: Answers = {
      [items[0].id]: "skip",
      [items[1].id]: "skip",
      [items[2].id]: "yes",
      [items[3].id]: "yes",
    };

    const score = computeScore({ answers, doneChannels: ["indoor-cricket"] });

    expect(score.eligible).toBe(6);
    expect(score.yes).toBe(2);
    expect(score.overall).toBe(33);
  });

  it("treats four yes, two skipped and four untouched items as 50%", () => {
    const items = itemsByChannel("music-festival");
    const answers: Answers = {};
    for (const item of items.slice(0, 4)) answers[item.id] = "yes";
    for (const item of items.slice(4, 6)) answers[item.id] = "skip";

    const score = computeScore({ answers, doneChannels: ["music-festival"] });

    expect(score.yes).toBe(4);
    expect(score.eligible).toBe(8);
    expect(score.overall).toBe(50);
  });

  it("keeps skipped items isolated to their own channel", () => {
    const indoor = itemsByChannel("indoor-cricket");
    const food = itemsByChannel("food");
    const withoutSkip = computeScore({
      answers: { [food[0].id]: "yes" },
      doneChannels: ["indoor-cricket", "food"],
    });
    const withSkip = computeScore({
      answers: { [indoor[0].id]: "skip", [food[0].id]: "yes" },
      doneChannels: ["indoor-cricket", "food"],
    });

    expect(withSkip.eligible).toBe(withoutSkip.eligible - 1);
    expect(withSkip.channels.find((entry) => entry.channel === "food")).toEqual(
      withoutSkip.channels.find((entry) => entry.channel === "food"),
    );
  });

  it("keeps era-neutral items in overall scoring only", () => {
    const items = itemsByChannel("indoor-cricket");
    const neutral = items.find((item) => item.eraNeutral);
    if (!neutral) throw new Error("indoor cricket seed is missing an era-neutral item");
    const answers: Answers = Object.fromEntries(
      items.filter((item) => item.id !== neutral.id).map((item) => [item.id, "yes"]),
    );

    const withNeutral = computeScore({ answers, doneChannels: ["indoor-cricket"] });
    const withoutNeutral = computeScore({
      answers: { ...answers, [neutral.id]: "skip" },
      doneChannels: ["indoor-cricket"],
    });

    expect(withNeutral.overall).not.toBe(withoutNeutral.overall);
    expect(withNeutral.pct90).toBe(withoutNeutral.pct90);
    expect(withNeutral.pct2000).toBe(withoutNeutral.pct2000);
  });

  it("hides era percentages and labels below six eligible era items", () => {
    const items = itemsByChannel("indoor-cricket");
    const answers: Answers = {};
    for (const item of items.slice(0, 5)) answers[item.id] = "yes";
    for (const item of items.slice(5)) answers[item.id] = "skip";

    const score = computeScore({ answers, doneChannels: ["indoor-cricket"] });

    expect(score.pct90).toBeNull();
    expect(score.pct2000).toBeNull();
    expect(score.eraLabel).toBeNull();
  });

  it("labels a 2000s-leaning user correctly", () => {
    const answers: Answers = {};
    for (const item of ITEMS) {
      if (item.channel !== "tv" && item.channel !== "tech") continue;
      if (item.era === "2000s") answers[item.id] = "yes";
      if (item.era === "90s") answers[item.id] = "skip";
    }

    const score = computeScore({ answers, doneChannels: ["tv", "tech"] });

    expect(score.pct90).toBe(0);
    expect(score.pct2000).not.toBeNull();
    expect(score.pct2000 ?? 0).toBeGreaterThan(60);
    expect(score.eraLabel).toBe(ERA_LABEL_2000S);
  });

  it("counts a both-era item toward both eras", () => {
    const books = itemsByChannel("books-school");
    const both = books.find((item) => item.era === "both");
    if (!both) throw new Error("books seed is missing a both-era item");
    if (books.some((item) => item.era !== "both")) {
      throw new Error("books seed should be all both-era for this test");
    }

    const score = computeScore({ answers: { [both.id]: "yes" }, doneChannels: ["books-school"] });

    expect(score.pct90).toBe(score.pct2000);
    expect(score.pct90).toBe(11);
  });

  it("only counts items from channels marked done", () => {
    const outdoorItem = itemsByChannel("outdoor")[0];
    const answers: Answers = { [outdoorItem.id]: "yes" };

    const partial = computeScore({ answers, doneChannels: ["tv"] });
    expect(partial.eligible).toBe(itemsByChannel("tv").length);
    expect(partial.yes).toBe(0);

    const complete = computeScore({ answers, doneChannels: ["tv", "outdoor"] });
    expect(complete.eligible).toBe(
      itemsByChannel("tv").length + itemsByChannel("outdoor").length,
    );
    expect(complete.yes).toBe(1);
  });

  it("has a breakdown for every done channel only", () => {
    const score = computeScore({ answers: {}, doneChannels: ["food", "tech"] });

    expect(score.channels.map((entry) => entry.channel)).toEqual(["food", "tech"]);
    expect(score.channels[0].eligible).toBe(itemsByChannel("food").length);
    expect(score.channels[1].eligible).toBe(itemsByChannel("tech").length);
  });
});

describe("era labels", () => {
  it("needs both era percentages", () => {
    expect(getEraLabel(null, 50)).toBeNull();
    expect(getEraLabel(50, null)).toBeNull();
  });

  it("uses a 12 point threshold", () => {
    expect(getEraLabel(50, 38)).toBe(ERA_LABEL_90S);
    expect(getEraLabel(50, 39)).toBe(ERA_LABEL_BOTH);
    expect(getEraLabel(30, 42)).toBe(ERA_LABEL_2000S);
    expect(getEraLabel(30, 41)).toBe(ERA_LABEL_BOTH);
  });
});

describe("title bands", () => {
  it("maps every band edge to positive Bangla text", () => {
    expect(getTitleBand(100).name).toBe("ছেলেবেলার জীবন্ত জাদুঘর");
    expect(getTitleBand(80).name).toBe("ছেলেবেলার জীবন্ত জাদুঘর");
    expect(getTitleBand(79).name).toBe("পাড়ার নস্টালজিয়া ক্যাপ্টেন");
    expect(getTitleBand(60).name).toBe("পাড়ার নস্টালজিয়া ক্যাপ্টেন");
    expect(getTitleBand(59).name).toBe("স্মৃতির ঝুলি ভরছে");
    expect(getTitleBand(40).name).toBe("স্মৃতির ঝুলি ভরছে");
    expect(getTitleBand(39).name).toBe("নতুন যুগের স্মৃতি-সন্ধানী");
    expect(getTitleBand(20).name).toBe("নতুন যুগের স্মৃতি-সন্ধানী");
    expect(getTitleBand(19).name).toBe("ছেলেবেলার নবীন অভিযাত্রী");
    expect(getTitleBand(0).name).toBe("ছেলেবেলার নবীন অভিযাত্রী");

    for (const percent of [0, 19, 39, 59, 79, 100]) {
      expect(getTitleBand(percent).description.length).toBeGreaterThan(0);
    }
  });
});

describe("helpers", () => {
  it("unlocks the result after three real, unique channels", () => {
    expect(isResultUnlocked([])).toBe(false);
    expect(isResultUnlocked(["tv", "food"])).toBe(false);
    expect(isResultUnlocked(["tv", "food", "not-a-channel"])).toBe(false);
    expect(isResultUnlocked(["tv", "tv", "food", "tech"])).toBe(true);
  });

  it("converts numbers to Bangla digits", () => {
    expect(toBanglaDigits(0)).toBe("০");
    expect(toBanglaDigits(1234567890)).toBe("১২৩৪৫৬৭৮৯০");
    expect(toBanglaDigits(2026)).toBe("২০২৬");
  });

  it("exports a fun-only disclaimer", () => {
    expect(DISCLAIMER).toBe("এটা শুধুই মজার স্কোর - কোনো বৈজ্ঞানিক পরীক্ষা নয়।");
  });
});
