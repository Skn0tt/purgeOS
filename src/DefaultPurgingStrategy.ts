import { Config } from ".";
import { PurgingStrategy } from "./PurgingStrategy";
import * as _ from "lodash";
import * as assert from "assert";
import { subDays, subWeeks, subMonths, differenceInHours } from "date-fns";

/**
 * Spans a grid of `size` items from scores `range.start` to `range.end`
 * Picks `size` items whose scores best match the grid.
 */
export function chooseEvenlyDistributedSubset<T>(
  as: T[],
  options: { range: [number, number]; size: number },
  score: (v: T) => number = (v: any) => +v
): T[] {
  const {
    range: [min, max],
    size,
  } = options;

  assert(size >= 0);

  if (as.length <= size) {
    return as;
  }

  as = as.sort((a, b) => score(a) - score(b));
  
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
        until: subDays(currentDate, 1),
        objectsPerDay: 25,
      },
      // for last week, half-daily objects are retained.
      {
        until: subWeeks(currentDate, 1),
        objectsPerDay: 2,
      },
      // for last month, bi-daily objects are retained.
      {
        until: subMonths(currentDate, 1),
        objectsPerDay: 1 / 2
      },
      // for everything else, bi-weekly objects are retained.
      {
        until: dateOfEarliestObject,
        objectsPerDay: 1 / 14
      },
    ];

    const enrichedRules = rules.map((rule, index) => {
      const precedingRule = rules[index - 1];
      const start = rule.until;
      let end = precedingRule?.until ?? currentDate;
      if (end < start) {
        end = start;
      }
      
      const hoursBetween = differenceInHours(end, start);
      const daysBetween = hoursBetween / 24;
      const size = daysBetween * rule.objectsPerDay;

      return {
        start,
        end,
        size
      }
    })

    const objectsToKeep = _.flatMap(enrichedRules, (rule) =>
      chooseEvenlyDistributedSubset(
        getObjectsUpdatedInRange(rule.start, rule.end),
        {
          range: [+rule.start, +rule.end],
          size: rule.size,
        },
        o => +o.updatedAt
      )
    );

    return objects.filter((o) => !objectsToKeep.includes(o));
  };
}
