import { getItem, isChannelId, type ChannelId } from "../data/items";
import type { Answers } from "./scoring";

export const STORAGE_KEY = "chhelebela-score:v1";
export const STORAGE_VERSION = 1 as const;

export type StoredView = "quiz" | "result";

export type StoredState = {
  version: typeof STORAGE_VERSION;
  answers: Answers;
  doneChannels: ChannelId[];
  currentChannel: ChannelId;
  view: StoredView;
};

export const DEFAULT_CHANNEL: ChannelId = "tv";

export function createDefaultState(): StoredState {
  return {
    version: STORAGE_VERSION,
    answers: {},
    doneChannels: [],
    currentChannel: DEFAULT_CHANNEL,
    view: "quiz",
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalize(raw: unknown): StoredState {
  if (!isRecord(raw) || raw.version !== STORAGE_VERSION) {
    return createDefaultState();
  }

  const answers: Answers = {};
  if (isRecord(raw.answers)) {
    for (const [id, value] of Object.entries(raw.answers)) {
      if (!getItem(id)) continue;
      if (value === "yes" || value === "skip") answers[id] = value;
    }
  }

  const doneChannels: ChannelId[] = [];
  if (Array.isArray(raw.doneChannels)) {
    const seen = new Set<ChannelId>();
    for (const id of raw.doneChannels) {
      if (!isChannelId(id) || seen.has(id)) continue;
      seen.add(id);
      doneChannels.push(id);
    }
  }

  return {
    version: STORAGE_VERSION,
    answers,
    doneChannels,
    currentChannel: isChannelId(raw.currentChannel) ? raw.currentChannel : DEFAULT_CHANNEL,
    view: raw.view === "result" ? "result" : "quiz",
  };
}

function getStorage(): Storage | null {
  return typeof globalThis.localStorage === "undefined" ? null : globalThis.localStorage;
}

export function load(): StoredState {
  try {
    const storage = getStorage();
    if (!storage) return createDefaultState();

    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultState();

    return normalize(JSON.parse(raw) as unknown);
  } catch {
    return createDefaultState();
  }
}

export function save(state: StoredState): void {
  try {
    const storage = getStorage();
    if (!storage) return;
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage can be unavailable or full - the quiz still works in memory.
  }
}

export function clear(): void {
  try {
    const storage = getStorage();
    if (!storage) return;
    storage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore unavailable storage.
  }
}
