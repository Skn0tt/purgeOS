import {GCSClient} from './GCSClient'
import {Config} from '.'

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

export function getStorageBackend(env: Config): StorageBackend {
  switch (env.backend) {
  case 'gcs':
    return new GCSClient(env)
  }
}
