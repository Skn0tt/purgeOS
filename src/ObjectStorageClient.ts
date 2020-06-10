import { GCSClient } from "./GCSClient";

export interface ObjectData {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ObjectStorageClient {
  getObjects(): Promise<ObjectData[]>;
  purgeObjects(objects: ObjectData[]): Promise<void>;
}

export function getObjectStorageClient(env: any): ObjectStorageClient {
  switch (env.backend) {
    case "gcs":
    default:
      return new GCSClient(env);
  }
}