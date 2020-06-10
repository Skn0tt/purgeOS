import _ from "lodash";
import { getConfig } from "./Config";
import { getObjectStorageClient } from "./ObjectStorageClient";
import { getPurgingStrategy } from "./PurgingStrategy";

async function main() {
  const config = getConfig();
  const osClient = getObjectStorageClient(config);
  const purgingStrat = getPurgingStrategy(config);

  const objects = await osClient.getObjects();
  const objectsToPurge = purgingStrat(objects, new Date());
  await osClient.purgeObjects(objectsToPurge.map(o => o.id));
}