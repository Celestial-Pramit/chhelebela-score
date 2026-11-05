import type { Channel, ChannelId, Item } from "@/data/items";
import type { Answer, Answers } from "./scoring";

export function toggleAnswer(current: Answer | undefined, next: Answer): Answer | undefined {
  return current === next ? undefined : next;
}

export function countUntouched(items: readonly Item[], answers: Answers): number {
  return items.filter((item) => answers[item.id] === undefined).length;
}

export function shouldConfirmFinish(untouchedCount: number): boolean {
  return untouchedCount > 0;
}

export function getNextRemainingChannel(
  channels: readonly Channel[],
  currentChannel: ChannelId,
  completed: readonly ChannelId[],
): ChannelId | null {
  const currentIndex = channels.findIndex((channel) => channel.id === currentChannel);
  if (currentIndex < 0) return null;
  const completedSet = new Set(completed);
  for (let offset = 1; offset <= channels.length; offset += 1) {
    const candidate = channels[(currentIndex + offset) % channels.length];
    if (!completedSet.has(candidate.id)) return candidate.id;
  }
  return null;
}

export function getChannelIndexForKey(
  currentIndex: number,
  channelCount: number,
  key: string,
): number | null {
  if (channelCount <= 0) return null;
  if (key === "Home") return 0;
  if (key === "End") return channelCount - 1;
  if (key === "ArrowRight") return (currentIndex + 1 + channelCount) % channelCount;
  if (key === "ArrowLeft") return (currentIndex - 1 + channelCount) % channelCount;
  return null;
}
