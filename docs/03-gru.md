## gru.iobio

Gru.iobio is the api powering the iobio client apps.

### Local development

- The Dockerfile starts the koa server
- The endpoints are not likely to change, so gru does not use nodemon to hot reload during local development.

__Any changes to the api endpoints require a server restart.__

### Data volume

- Gru uses a SQLite in-memory database backed by a data volume.

```bash
# create docker volume for bind mount to container
mkdir sqlite/data
```

Follow the [full setup instructions](https://github.com/iobio/iobio-gru-backend/blob/master/docs/populating_data_directory.md) to populate the volume. It should look like this when complete:

```
sqlite/data/
├── gene2pheno
├── geneinfo
├── genomebuild
├── gnomad_header.txt
├── md5_reference_cache
├── references
└── vep-cache
```

### Docs

Read the full docs at [https://github.com/iobio/iobio-gru-backend](https://github.com/iobio/iobio-gru-backend)
