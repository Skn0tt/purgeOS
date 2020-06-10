import { ObjectData } from "./ObjectStorageClient";
import { StrategyConfig } from "./Config";
import { makeDefaultPurgingStrategy } from "./DefaultPurgingStrategy";

export type PurgingStrategy = (
  objects: ObjectData[],
  currentDate: Date
) => ObjectData[];

export function getPurgingStrategy(config: StrategyConfig): PurgingStrategy {
  switch (config.STRATEGY) {
    case "default":
      return makeDefaultPurgingStrategy(config);
  }
}