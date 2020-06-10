import { BackendConfig } from "./Config";
import { GCSClient } from "./GCSClient";

export interface ObjectData {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ObjectStorageClient {
  getObjects(): Promise<ObjectData[]>;
  purgeObjects(objectIds: string[]): Promise<void>;
}

export function getObjectStorageClient(env: BackendConfig): ObjectStorageClient {
  switch (env.BACKEND) {
    case "gcs":
      return new GCSClient(env);
  }
}