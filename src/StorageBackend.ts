import {GCSClient} from './GCSClient'

export interface ObjectData<T = any> {
  id: string;
  name: string;
  updatedAt: Date;
  _file: T;
}

export interface StorageBackend {
  getObjects(): Promise<ObjectData[]>;
  purgeObjects(objects: ObjectData[]): Promise<void>;
}

export function getStorageBackend(env: any): StorageBackend {
  switch (env.backend) {
  case 'gcs':
  default:
    return new GCSClient(env)
  }
}
