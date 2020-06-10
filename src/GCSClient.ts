import {ObjectStorageClient, ObjectData} from './ObjectStorageClient'
import {Config} from '.'

export class GCSClient implements ObjectStorageClient {
  constructor(config: Config) {}

  async getObjects(): Promise<ObjectData[]> {
    return []
  }

  async purgeObjects(objects: ObjectData[]): Promise<void> {}
}
