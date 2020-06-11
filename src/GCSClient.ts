import {ObjectStorageClient, ObjectData} from './ObjectStorageClient'
import {Config} from '.'
import { Storage, Bucket, File } from "@google-cloud/storage"
import * as assert from "assert"

export class GCSClient implements ObjectStorageClient {

  private readonly bucket: Bucket;

  constructor(config: Config) {
    assert(!!config.gcsClientEmail, "Please provide a GCS Client Email");
    assert(!!config.gcsPrivateKey, "Please provide a GCS Private Key");
    assert(!!config.bucket, "Please provide a bucket identifier");
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
      updatedAt: new Date(f.metadata.updated),
      _file: f,
    }))
  }

  async purgeObjects(objects: ObjectData<File>[]): Promise<void> {
    await Promise.all(
      objects.map(o => o._file.delete())
    );
  }
}
