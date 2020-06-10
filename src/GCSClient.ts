import { ObjectStorageClient, ObjectData } from "./ObjectStorageClient";
import { TaggedBackendConfig } from "./Config";

export interface GCSConfig extends TaggedBackendConfig<"gcs"> {

}

export class GCSClient implements ObjectStorageClient {
  constructor(config: GCSConfig) {
  }

  async getObjects(): Promise<ObjectData[]> {
    throw new Error("Method not implemented.");
  }
  async purgeObjects(objectIds: string[]): Promise<void> {}
}
