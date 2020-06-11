import {ObjectStorageClient, ObjectData} from './ObjectStorageClient'
import {Config} from '.'
import { Storage, Bucket, File } from "@google-cloud/storage"
import * as assert from "assert"

export class GCSClient implements ObjectStorageClient {

  private readonly bucket: Bucket;

  constructor(config: Config) {
    assert(!!config.gcsClientEmail);
    assert(!!config.gcsPrivateKey);
    assert(!!config.bucket);
    const storage = new Storage({
      credentials: {
        client_email: config.gcsClientEmail,
        private_key: config.gcsPrivateKey
      }
    });
    this.bucket = storage.bucket(config.bucket);
  }

  async getObjects(): Promise<ObjectData<File>[]> {
    const [ files ] = await this.bucket.getFiles();
    return files.map(f => ({
      id: f.id!,
      name: f.name,
      updatedAt: f.metadata.updated,
      _file: f,
    }))
  }

  async purgeObjects(objects: ObjectData<File>[]): Promise<void> {
    await Promise.all(
      objects.map(o => o._file.delete())
    );
  }
}
