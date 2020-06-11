import { Config } from ".";
import { PurgingStrategy } from "./PurgingStrategy";
import * as _ from "lodash";
import * as assert from "assert";
import { subDays, subWeeks, subMonths } from "date-fns";
import { ObjectData } from "./ObjectStorageClient";

/**
 * Spans a grid of `size` items from scores `range.start` to `range.end`
 * Picks `size` items whose scores best match the grid.
 */
export function chooseEvenlyDistributedSubset<T>(
  as: T[],
  options: { range: [number, number]; size: number },
  score: (v: T) => number = (v: any) => +v
): T[] {
  if (as.length <= options.size) {
    return as;
  }

  as = as.sort((a, b) => score(a) - score(b));

  const {
    range: [min, max],
    size,
  } = options;
  const perfectDistance = (max - min) / (size - 1);

  const result: T[] = [];

  let aPointer = 0;
  for (let i = 0; i < size; i++) {
    const goal = min + i * perfectDistance;

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
    const dateOfEarliestObject = _.min(objects.map((o) => o.updatedAt))!;
    function getObjectsUpdatedInRange(start: Date, end: Date) {
      return objects.filter((o) => o.updatedAt >= start && o.updatedAt <= end);
    }

    const rules = [
      // for last day, hourly objects are retained.
      {
        start: subDays(currentDate, 1),
        end: currentDate,
        size: 25,
      },
      // for last week, half-daily objects are retained.
      {
        start: subWeeks(currentDate, 1),
        end: subDays(currentDate, 1),
        size: 6 * 2,
      },
      // for last month, bi-daily objects are retained.
      {
        start: subMonths(currentDate, 1),
        end: subWeeks(currentDate, 1),
        size: (3 * 7) / 2,
      },
      // for everything else, 10 objects are retained.
      {
        start: dateOfEarliestObject,
        end: subMonths(currentDate, 1),
        size: 10,
      },
    ];

    function score(o: ObjectData) {
      return +o.updatedAt;
    }

    const objectsToKeep = _.flatMap(rules, (rule) =>
      chooseEvenlyDistributedSubset(
        getObjectsUpdatedInRange(rule.start, rule.end),
        {
          range: [+rule.start, +rule.end],
          size: rule.size,
        },
        score
      )
    );

    return objects.filter((o) => !objectsToKeep.includes(o));
  };
}
