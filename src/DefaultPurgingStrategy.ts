import { Config } from ".";
import { PurgingStrategy } from "./PurgingStrategy";

export function range(min: number, max?: number): number[] {
  if (typeof max === "undefined") {
    return range(0, min);
  }

  return Array(max - min).fill(0).map((_, i) => i + min);
}

// source: https://stackoverflow.com/a/32253851/8714863
export function chooseEvenlyDistributedSubset<T>(
  a: T[],
  score: (v: T) => number,
  sizeOfSubset: number
): T[] {
  const n = a.length;
  const table: number[][] = Array(n)
    .fill(0)
    .map(() => Array(sizeOfSubset).fill(Number.MAX_VALUE));

  for (let i of range(1, n)) {
    for (let j of range(sizeOfSubset)) {
      table[i][j] = Math.max(
        ...range(i).map(k => Math.min(
          table[k][j],
          score(a[i]) - score(a[k])
        ))
      )
    }
  }
  return a;
}

/**
 * For last day, hourly objects are retained.
 * For last week, half-daily objects are retained.
 * For last month, bi-daily objects are retained.
 * For last year, bi-weekly objects are retained.
 * For everything else, bi-monthly objects are retained.
 */
export function makeDefaultPurgingStrategy(config: Config): PurgingStrategy {
  return function DefaultPurgingStrategy(objects, currentDate) {
    return objects;
  };
}
