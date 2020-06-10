import { Config } from ".";
import { PurgingStrategy } from "./PurgingStrategy";

export function makeDefaultPurgingStrategy(config: Config): PurgingStrategy {
  return function DefaultPurgingStrategy(objects, currentDate) {
    return objects;
  }
}