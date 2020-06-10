import { GCSConfig } from "./GCSClient";
import { DefaultPurgingStrategyConfig } from "./DefaultPurgingStrategy";
import _ from "lodash";

export type TaggedBackendConfig<T extends string> = { BACKEND: T };

export type BackendConfig = GCSConfig;

export type TaggedStrategyConfig<T extends string> = { STRATEGY: T };

export type StrategyConfig = DefaultPurgingStrategyConfig;

export type Config = BackendConfig & StrategyConfig;

export function getConfig(): Config {
  return _.defaults<NodeJS.ProcessEnv, Config>(process.env, {
    BACKEND: "gcs",
    STRATEGY: "default"
  })
}