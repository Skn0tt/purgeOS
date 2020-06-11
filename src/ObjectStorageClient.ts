import {GCSClient} from './GCSClient'

export interface ObjectData<T = any> {
  id: string;
  name: string;
  updatedAt: Date;
  _file: T;
}

export interface ObjectStorageClient {
  getObjects(): Promise<ObjectData[]>;
  purgeObjects(objects: ObjectData[]): Promise<void>;
}

export function getObjectStorageClient(env: any): ObjectStorageClient {
  switch (env.backend) {
  case 'gcs':
  default:
    return new GCSClient(env)
  }
}
