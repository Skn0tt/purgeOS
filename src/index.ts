import {Command, flags} from '@oclif/command'
import {getObjectStorageClient} from './ObjectStorageClient'
import {getPurgingStrategy} from './PurgingStrategy'

export interface Config {
  backend: 'gcs';
  strategy: 'default';
}

class PurgeOS extends Command {
  static description =
    'Purge old files from object storage. Awesome to reduce your cloud bill 💵';

  static flags = {
    version: flags.version(),
    help: flags.help({char: 'h'}),
    verbose: flags.boolean({
      description: 'Verbose',
      env: 'VERBOSE',
      default: false,
      char: 'v',
    }),
    backend: flags.enum({
      description: 'Storage Backend',
      env: 'BACKEND',
      options: ['gcs'],
      default: 'gcs',
    }) as flags.IOptionFlag<'gcs'>,
    strategy: flags.enum({
      description: 'Strategy',
      env: 'STRATEGY',
      options: ['default'],
      default: 'default',
    }) as flags.IOptionFlag<'default'>,
  };

  async run() {
    this.log('### purgeOS ###')

    const {flags} = this.parse(PurgeOS)

    const backend = getObjectStorageClient(flags)
    const strategy = getPurgingStrategy(flags)

    this.log('Fetching objects from storage backend ...')
    const objects = await backend.getObjects()
    this.log(`Found ${objects.length} objects.`)

    this.log('Deciding which ones to purge ...')
    const objectsToPurge = strategy(objects, new Date())

    if (flags.verbose) {
      this.log('Will purge the following objects:')
      this.log(objectsToPurge.map(o => JSON.stringify(o)).join('\n'))
    } else {
      this.log(`Will purge ${objectsToPurge.length} objects.`)
    }

    this.log('Purging ...')
    await backend.purgeObjects(objectsToPurge)
    this.log('Done.')
  }
}

export default PurgeOS
