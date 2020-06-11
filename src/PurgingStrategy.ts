import {ObjectData} from './StorageBackend'
import {Config} from '.'
import {makeDefaultPurgingStrategy} from './DefaultPurgingStrategy'

/**
 * Given objects and the current date,
 * it returns all objects to be purged.
 */
export type PurgingStrategy = (
  objects: ObjectData[],
  currentDate: Date
) => ObjectData[];

export function getPurgingStrategy(config: Config): PurgingStrategy {
  switch (config.strategy) {
  case 'default':
    return makeDefaultPurgingStrategy(config)
  }
}
