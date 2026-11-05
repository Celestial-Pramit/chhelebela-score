import { describe, expect, it } from "vitest";
import { CHANNELS, ITEMS, getItem, isChannelId, itemsByChannel } from "./items";

describe("channels", () => {
  it("has seven channels in display order", () => {
    expect(CHANNELS).toHaveLength(7);
    expect(CHANNELS.map((channel) => channel.n)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(new Set(CHANNELS.map((channel) => channel.id)).size).toBe(CHANNELS.length);
  });

  it("keeps TV short names within 14 characters", () => {
    for (const channel of CHANNELS) {
      expect(channel.short.length).toBeLessThanOrEqual(14);
    }
  });

  it("recognises only real channel ids", () => {
    expect(isChannelId("tv")).toBe(true);
    expect(isChannelId("tech")).toBe(true);
    expect(isChannelId("games")).toBe(false);
    expect(isChannelId(null)).toBe(false);
  });
});

describe("items", () => {
  it("has unique ids and unique n values", () => {
    expect(new Set(ITEMS.map((item) => item.id)).size).toBe(ITEMS.length);
    expect(new Set(ITEMS.map((item) => item.n)).size).toBe(ITEMS.length);
  });

  it("points every item at a known channel", () => {
    for (const item of ITEMS) {
      expect(isChannelId(item.channel)).toBe(true);
    }
  });

  it("keeps every channel stocked with at least eight items", () => {
    for (const channel of CHANNELS) {
      expect(itemsByChannel(channel.id).length).toBeGreaterThanOrEqual(8);
    }
  });

  it("keeps itemsByChannel and getItem consistent", () => {
    const total = CHANNELS.reduce(
      (count, channel) => count + itemsByChannel(channel.id).length,
      0,
    );
    expect(total).toBe(ITEMS.length);

    for (const channel of CHANNELS) {
      for (const item of itemsByChannel(channel.id)) {
        expect(item.channel).toBe(channel.id);
        expect(getItem(item.id)).toBe(item);
      }
    }

    expect(getItem("missing-item")).toBeUndefined();
  });
});
