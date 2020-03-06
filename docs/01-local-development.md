### Local Development with Docker

Download Docker community edition and read the documentation:

[https://www.docker.com/get-started](https://www.docker.com/get-started)

```bash
# Check that docker has been installed correctly
docker --version

# Check that docker-compose has been installed correctly
docker-compose --version
```

The entire container stack is configured via `docker-compose`.  Docker compose will:

- bootstrap the containers
- set up the local network
- start the servers

__NOTES:__

Edit /etc/hosts to allow custom hosts.

```bash
# /etc/hosts
127.0.0.1     gene.iobio gru.iobio
```

__Some apps may require additional configuration. Be sure to read each app's documentation.__

```bash
# Start all services after app specific config has been completed
docker-compose up
```

### Services Overview

| Service | Description | Host | Exposed Port |
|---------|-------------|----- | -------------|
| traefik | A load balancer to handle incoming web traffic and routing | http://localhost | 80 |
| traefik dashboard | A services dashboard provided by traefik | http://localhost | 8080 |
| gene | A client app for investigating potential disease-causing variants in real-time | [http://gene.iobio](http://gene.iobio) | 3000 |
| gru | Iobio backend service | [http://gru.iobio](http://gru.iobio) | 9001 |

```bash
# Check running docker containers & ports:

docker ps
```

Not all iobio services are included in this repo, but other services could be added in the future.
