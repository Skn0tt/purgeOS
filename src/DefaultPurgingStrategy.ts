import { Config } from ".";
import { PurgingStrategy } from "./PurgingStrategy";
import * as _ from "lodash";
import * as assert from "assert";
import { subDays, subWeeks } from "date-fns";

/**
 * Spans a grid of `size` items from scores `range.start` to `range.end`
 * Picks `size` items whose scores best match the grid.
 */
export function chooseEvenlyDistributedSubset<T>(
  as: T[],
  options: { range: [number, number], size: number },
  score: (v: T) => number = (v: any) => +v,
): T[] {
  if (as.length <= options.size) {
    return as;
  }

  as = as.sort((a, b) => score(a) - score(b));

  const { range: [min, max], size } = options;
  const perfectDistance = (max - min) / (size - 1);

  const result: T[] = [];

  let aPointer = 0;
  for (let i = 0; i < size; i++) {
    const goal = min + (i * perfectDistance);

    while (true) {
      if (aPointer + 1 >= as.length) {
        result.push(as[aPointer]);
        break;
      }

      const currentA = as[aPointer];
      const nextA = as[aPointer + 1];

      const currentFit = Math.abs(score(currentA) - goal);
      const nextFit = Math.abs(score(nextA) - goal);

      aPointer++;

      const currentIsBetterThanNextOne = currentFit < nextFit;
      if (currentIsBetterThanNextOne) {
        result.push(currentA);
        break;
      }
    }
  }

  assert(result.length == size);

  return result;
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
    function getObjectsUpdatedSince(date: Date) {
      return objects.filter(o => o.updatedAt >= date);
    }

    const objectsToKeep = [
      ...chooseEvenlyDistributedSubset(
        getObjectsUpdatedSince(
          subDays(currentDate, 1),
        ),
        {
          range: [
            +subDays(currentDate, 1),
            +currentDate
          ],
          size: 25
        },
        d => +d.updatedAt
      )
    ]

    return objects.filter(o => !objectsToKeep.includes(o));
  };
}
