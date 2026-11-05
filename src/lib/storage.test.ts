import { afterEach, describe, expect, it, vi } from "vitest";
import { ITEMS } from "../data/items";
import {
  STORAGE_KEY,
  clear,
  createDefaultState,
  load,
  save,
  type StoredState,
} from "./storage";

function installStorage(initial?: string): Map<string, string> {
  const data = new Map<string, string>();
  if (initial !== undefined) data.set(STORAGE_KEY, initial);

  const storage: Storage = {
    get length() {
      return data.size;
    },
    clear: () => data.clear(),
    getItem: (key) => data.get(key) ?? null,
    key: (index) => [...data.keys()][index] ?? null,
    removeItem: (key) => {
      data.delete(key);
    },
    setItem: (key, value) => {
      data.set(key, value);
    },
  };

  vi.stubGlobal("localStorage", storage);
  return data;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("storage load", () => {
  it("returns a safe default without stored data", () => {
    installStorage();
    expect(load()).toEqual(createDefaultState());
  });

  it("returns a safe default when localStorage is missing", () => {
    vi.stubGlobal("localStorage", undefined);
    expect(load()).toEqual(createDefaultState());
  });

  it("ignores corrupt JSON", () => {
    installStorage("{not valid json");
    expect(load()).toEqual(createDefaultState());
  });

  it("rejects an unknown version", () => {
    const stored = { ...createDefaultState(), version: 2 };
    installStorage(JSON.stringify(stored));
    expect(load()).toEqual(createDefaultState());
  });

  it("drops unknown item ids and invalid answers", () => {
    const valid = ITEMS[0];
    installStorage(
      JSON.stringify({
        version: 1,
        answers: {
          [valid.id]: "yes",
          "ghost-item": "yes",
          [ITEMS[1].id]: "maybe",
        },
        doneChannels: ["tv", "ghost-channel", "tv"],
        currentChannel: "ghost-channel",
        view: "something-else",
      }),
    );

    const state = load();

    expect(state.answers).toEqual({ [valid.id]: "yes" });
    expect(state.doneChannels).toEqual(["tv"]);
    expect(state.currentChannel).toBe("tv");
    expect(state.view).toBe("quiz");
  });

  it("accepts a valid stored result view", () => {
    const stored: StoredState = {
      version: 1,
      answers: { [ITEMS[0].id]: "skip" },
      doneChannels: ["tv", "food", "tech"],
      currentChannel: "tech",
      view: "result",
    };
    installStorage(JSON.stringify(stored));

    expect(load()).toEqual(stored);
  });
});

describe("storage save and clear", () => {
  it("round-trips a valid state", () => {
    installStorage();
    const state: StoredState = {
      version: 1,
      answers: { [ITEMS[2].id]: "yes" },
      doneChannels: ["tv"],
      currentChannel: "tv",
      view: "quiz",
    };

    save(state);
    expect(load()).toEqual(state);
  });

  it("clears the stored state", () => {
    installStorage();
    save(createDefaultState());
    clear();

    expect(load()).toEqual(createDefaultState());
  });

  it("survives storage that throws", () => {
    const blocked: Storage = {
      get length() {
        return 0;
      },
      clear: () => undefined,
      getItem: () => {
        throw new Error("blocked");
      },
      key: () => null,
      removeItem: () => undefined,
      setItem: () => {
        throw new Error("blocked");
      },
    };
    vi.stubGlobal("localStorage", blocked);

    expect(load()).toEqual(createDefaultState());
    expect(() => save(createDefaultState())).not.toThrow();
    expect(() => clear()).not.toThrow();
  });
});
