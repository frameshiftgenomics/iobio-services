## gene.iobio

Gene.iobio is a client application for investigating potential disease-causing variants in real-time.

### Local development

- When gene is running in development mode, its served by an express server.
- Nodemon starts the server and watches for server file changes.
- Webpack watches changes to the client, and recompiles the client bundle.
- A page refresh is needed in order to view changes.

### Env file

```bash
# create client env file, edit as necessary
cp .env.template .env

```

__NOTES:__

- Point the backend url to be `gru.localhost` for local development.
- Append the backend url with `/api` to proxy all requests to the backend in production. The proxy will strip the prefix automatically.

### Production

- In production, the client bundle is built and is served with nginx.

### Docs

Read the full docs at [https://github.com/iobio/gene.iobio.vue](https://github.com/iobio/gene.iobio.vue)
