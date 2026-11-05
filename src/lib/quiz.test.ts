import { describe, expect, it } from "vitest";
import { CHANNELS, itemsByChannel } from "../data/items";
import { type Answers } from "./scoring";
import {
  countUntouched,
  getChannelIndexForKey,
  getNextRemainingChannel,
  shouldConfirmFinish,
  toggleAnswer,
} from "./quiz";

describe("quiz interactions", () => {
  it("toggles yes and skip independently", () => {
    expect(toggleAnswer(undefined, "yes")).toBe("yes");
    expect(toggleAnswer("yes", "yes")).toBeUndefined();
    expect(toggleAnswer("yes", "skip")).toBe("skip");
    expect(toggleAnswer("skip", "skip")).toBeUndefined();
    expect(toggleAnswer("skip", "yes")).toBe("yes");
  });

  it("counts untouched items for completion confirmation", () => {
    const items = itemsByChannel("food");
    const answers: Answers = {
      [items[0].id]: "yes",
      [items[1].id]: "skip",
    };
    expect(countUntouched(items, answers)).toBe(items.length - 2);
    expect(countUntouched(items, {})).toBe(items.length);
    expect(shouldConfirmFinish(0)).toBe(false);
    expect(shouldConfirmFinish(2)).toBe(true);
  });

  it("finds the next unfinished channel with wraparound", () => {
    expect(getNextRemainingChannel(CHANNELS, "tv", ["tv", "outdoor"])).toBe("indoor-cricket");
    expect(getNextRemainingChannel(CHANNELS, "tech", ["tv", "outdoor"])).toBe("indoor-cricket");
    expect(getNextRemainingChannel(CHANNELS, "tech", CHANNELS.map((channel) => channel.id))).toBeNull();
  });

  it("supports keyboard channel navigation", () => {
    expect(getChannelIndexForKey(2, 7, "ArrowRight")).toBe(3);
    expect(getChannelIndexForKey(0, 7, "ArrowLeft")).toBe(6);
    expect(getChannelIndexForKey(2, 7, "Home")).toBe(0);
    expect(getChannelIndexForKey(2, 7, "End")).toBe(6);
    expect(getChannelIndexForKey(2, 7, "Enter")).toBeNull();
  });
});
