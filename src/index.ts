import {Command, flags} from '@oclif/command'
import {getStorageBackend} from './StorageBackend'
import {getPurgingStrategy} from './PurgingStrategy'
import cli from 'cli-ux'

export interface Config {
  backend: 'gcs';
  strategy: 'tiered';
  bucket?: string;
  gcsClientEmail?: string;
  gcsPrivateKey?: string;
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
    yes: flags.boolean({
      description: 'Skip Prompt',
      env: 'YES',
      default: false,
      char: 'y',
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
      options: ['tiered'],
      default: 'tiered',
    }) as flags.IOptionFlag<'tiered'>,
    bucket: flags.string({
      description: 'Bucket',
      env: 'BUCKET',
    }),
    gcsClientEmail: flags.string({
      description: 'GCS Client Email',
      env: 'GCS_CLIENT_EMAIL',
    }),
    gcsPrivateKey: flags.string({
      description: 'GCS Private Key',
      env: 'GCS_PRIVATE_KEY',
    }),
  };

  async run() {
    this.log('### purgeOS ###')

    const {flags} = this.parse(PurgeOS)

    flags.yes = flags.yes || !!process.env.yes
    
    const backend = getStorageBackend(flags)
    const strategy = getPurgingStrategy(flags)

    this.log('Fetching objects from storage backend ...')
    const objects = await backend.getObjects()
    this.log(`Found ${objects.length} objects.`)

    this.log('Deciding which ones to purge ...')
    const objectsToPurge = strategy(objects, new Date())

    if (objectsToPurge.length === 0) {
      this.log('Nothing to purge.')
      return
    }

    if (flags.verbose) {
      this.log('Will purge the following objects:')
      this.log(objectsToPurge.map(o => o.name).join('\n'))
    } else {
      this.log(`Will purge ${objectsToPurge.length} objects.`)
    }

    if (!flags.yes) {
      const confirmed = await cli.confirm('Purge?')
      if (!confirmed) {
        return
      }
    }

    this.log('Purging ...')
    await backend.purgeObjects(objectsToPurge)
    this.log('Done.')
  }
}

export default PurgeOS
