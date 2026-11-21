type Queue = {
  id: number;
  open: boolean;
  waitSeconds: number | null;
};

export type WaitCategory = "short" | "medium" | "long";

export function classifyQueueWaits(
  queues: readonly Queue[],
): Map<number, WaitCategory> {
  const openQueues = queues.filter(
    (queue): queue is Queue & { waitSeconds: number } =>
      queue.open && queue.waitSeconds !== null,
  );
  const categories = new Map<number, WaitCategory>();
  if (openQueues.length === 0) return categories;

  const waits = openQueues.map((queue) => queue.waitSeconds);
  const shortest = Math.min(...waits);
  const longest = Math.max(...waits);

  for (const queue of openQueues) {
    categories.set(
      queue.id,
      queue.waitSeconds === shortest
        ? "short"
        : queue.waitSeconds === longest
          ? "long"
          : "medium",
    );
  }
  return categories;
}
