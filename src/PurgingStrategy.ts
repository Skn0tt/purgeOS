import {ObjectData} from './ObjectStorageClient'
import {Config} from '.'
import {makeDefaultPurgingStrategy} from './DefaultPurgingStrategy'

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
