import { TaggedStrategyConfig } from "./Config";
import { PurgingStrategy } from "./PurgingStrategy";

export interface DefaultPurgingStrategyConfig extends TaggedStrategyConfig<"default"> {

}

export function makeDefaultPurgingStrategy(config: DefaultPurgingStrategyConfig): PurgingStrategy {
  return function DefaultPurgingStrategy(objects, currentDate) {
    return objects;
  }
}