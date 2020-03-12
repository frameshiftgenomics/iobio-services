### gene.iobio

Gene.iobio is a client application for investigating potential disease-causing variants in real-time.

### Local development

When gene is running in development mode, it runs on an express server. Nodemon runs the server to watch for file changes.

Webpack watches changes to the client files, and recompiles the client bundle. A page refresh is needed in order to view changes.

### Production

In production, the client bundle is built and is served with nginx.

### Docs

Read the full docs [here](../gene/README.md).
