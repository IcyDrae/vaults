- When contributing to this repository, please open an issue first and explain the change- feature, bug, optimization?
    - what part of the application is the issue about, API or Frontend?
    - platform details(Windows, macOS, Linux and more about the development you are on)

### Pull requests

1. Please follow this [commit naming convention](https://www.conventionalcommits.org/en/v1.0.0/)
   and keep a level of verbosity(comments in the code etc.)
2. Update the README.md with details of changes, this includes any major changes that
   result to changes in the usage of the API.

---

### Getting started locally

This project runs completely on Docker, there are four services being orchestrated with Docker Compose:
- db(MySQL),
- api(PHP 8.0 FPM),
- server(NGINX 1.20 Alpine)
- spa(Vue.js frontend).

1. Copy .env.example and set the allowed origin. This is important, so the API can respond to its frontend.

```shell
cp .env.example .env.dev.local
```

2. Copy the docker-compose.env.example and fill the variables out.

```shell
cp docker-compose.env.example docker-compose.env
```

3. Copy the NGINX & Xdebug config files and set your local hostname; also don't forget to add the hostname to your host's ```/etc/hosts``` and the Xdebug port.

```shell
cp config/packages/dev/docker/server/default.conf.example config/packages/dev/docker/server/default.conf
cp config/packages/dev/docker/api/conf.d/docker-php-ext-debug.ini.example config/packages/dev/docker/api/conf.d/docker-php-ext-debug.ini
```

4.1. Copy the frontend config file and set the variables:

The frontend files reside under ``` web```, completely separated and independent of Symfony and Twig etc.

```shell
cp web/.env.development.local.example web/.env.development.local
```

4.2. Install npm dependencies

```shell
cd web
npm install
```

5. Create the SSL certificate and its corresponding key for your hostname.

```shell
sudo openssl req -x509 \
                 -nodes \
                 -days 365 \
                 -newkey rsa:2048 \
                 -keyout /etc/ssl/private/selfsigned/site.key \
                 -out /etc/ssl/certs/selfsigned/site.crt
```

6. Copy the certificate + key in the project files for docker compose, 
and then import them in your preferred browser.

```shell
cp /etc/ssl/private/selfsigned/site.key config/packages/dev/docker/server/password-manager.key
cp /etc/ssl/certs/selfsigned/site.crt config/packages/dev/docker/server/password-manager.crt
```

7. Build the images & create the containers with docker-compose.

```shell
docker-compose --env-file docker-compose.env up --build --detach
```

8. Create the database.

````shell
docker exec -it password-manager_api ./bin/console doctrine:migrations:migrate --env=dev
````

9. In other terminal windows you can monitor the server container as well as the frontend container with the following commands:

```shell
docker logs --follow password-manager_server
```

```shell
docker logs --follow password-manager_spa
```

That's it! Now you're ready to start developing!
