purgeOS
=======

*purgeObjectStorage* | *purgeOldStuff*

Purge old backup files from object storage.
Awesome to reduce your cloud bill 💵

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/purgeos.svg)](https://npmjs.org/package/purgeos)
[![Downloads/week](https://img.shields.io/npm/dw/purgeos.svg)](https://npmjs.org/package/purgeos)
[![License](https://img.shields.io/npm/l/purgeos.svg)](https://github.com/https://github.com/skn0tt/purgeOS/blob/master/package.json)

<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false} -->

<!-- code_chunk_output -->

- [Getting Started](#getting-started)
- [Storage Backends](#storage-backends)
  - [Google Cloud Storage](#google-cloud-storage)
- [Purging Strategies](#purging-strategies)
  - [Default](#default)
- [Contributing](#contributing)

<!-- /code_chunk_output -->

## Getting Started

`purgeOS` can be used to thinnen your backups. At the moment, it supports GCS and a tiered retention strategy, but it's trivial to add more!

You can use either the [NPM package](https://npmjs.org/package/purgeos) or the [Docker Image](https://github.com/Skn0tt/purgeOS/packages/265067).

```sh-session
$ yarn global add purgeos
$ purgeOS \
    --strategy=default \
    --backend=gcs \
    --bucket=my-backup-bucket \
    --gcs-client-email=... \
    --gcs-private-key=...
```

```sh-session
$ docker run \
  -e STRATEGY=default \
  -e BACKEND=gcs \
  -e BUCKET=my-backup-bucket \
  -e GCS_CLIENT_EMAIL=... \
  -e GCS_PRIVATE_KEY=... \
  docker.pkg.github.com/skn0tt/purgeos/purgeos:latest
```

I recommend setting up a cron job / scheduled container run to keep your backups tidy.

## Storage Backends

More backends can be added easily, feel free to provide a PR! :)

### Google Cloud Storage

Enable using `--backend=gcs` or `BACKEND=gcs`.

Configuration:

| Flag                 | Env var            | Description                         |
|----------------------|--------------------|-------------------------------------|
| `--bucket`           | `BUCKET`           | The bucket to prune                 |
| `--gcs-client-email` | `GCS_CLIENT_EMAIL` | The client email of the IAM account |
| `--gcs-private-key`  | `GCS_PRIVATE_KEY`  | The private key of the IAM account  |

## Purging Strategies

More strategies can be added easily, feel free to provide a PR! :)

### Default

Enable using `--strategy=default` or `STRATEGY=default`.

Will retain hourly objects for the last day,  
half-daily objects for the last week,  
bi-daily objects for last month,  
bi-weekly objects for last year,  
bi-monthly objects for everything before.

## Contributing

Feel free to make this better! 🎉  
Every kind of contribution is welcome: docs, code, typo corrections, blog posts ...
If you don't know where to start, don't hesitate to reach out ☺️
