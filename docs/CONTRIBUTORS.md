- When contributing to this repository, please open an issue first and explain the change- is it a feature, a bug report or an optimization?
    - what part of the application is the issue about, API or Frontend?
    - platform details(Windows, macOS, Linux and more about the development environment you are on)

### Pull requests

1. Please follow this [commit naming convention](https://www.conventionalcommits.org/en/v1.0.0/)
   and keep a level of verbosity(comments in the code when necessary etc.)
2. Update the README.md with details of changes, this includes any major changes that
   result to changes in the usage of the API.

### Project structure:

- `api` is where the Rest API, written in PHP, is located,
- `docker` contains all configs related to docker,
- `docs` contains only documentation files,
- `frontend` is where all the Vue 3 frontend files are

---

### Getting started locally

This project runs completely on Docker, there are four services being orchestrated with Docker Compose:
- mysql(MySQL 8.0),
- php(PHP 8.0 FPM),
- nginx(NGINX 1.20 Alpine)
- vue(Vue 3 frontend).

1. Copy ./api/.env.example and set the allowed origin. This is important, so the API can respond to its frontend.

```shell
cp ./api/.env.example ./api/.env.dev.local
```

2. Copy the ./docker/docker-compose.env.example and fill the variables out.

```shell
cp ./docker/docker-compose.env.example ./docker/docker-compose.env
```

3. Copy the NGINX & Xdebug config files and set your local hostname; also don't forget to add the hostname to your host's ```/etc/hosts``` and the Xdebug port.

```shell
cp ./docker/nginx/default.conf.example ./docker/nginx/server/default.conf
cp ./docker/php/conf.d/docker-php-ext-debug.ini.example ./docker/php/conf.d/docker-php-ext-debug.ini
```

4.1. Copy the frontend config file and set the variables:

```shell
cp ./frontend/.env.development.local.example ./frontend/.env.development.local
```

4.2. Install npm dependencies

In the `vaults_vue` container:

```shell
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

6. Copy the certificate + key in the project files for docker compose, and then import them in your preferred browser.

```shell
cp /etc/ssl/private/selfsigned/site.key ./docker/nginx/password-manager.key
cp /etc/ssl/certs/selfsigned/site.crt ./docker/nginx/password-manager.crt
```

7. Build the images & create the containers with docker-compose.

```shell
cd ./docker;
docker-compose --env-file docker-compose.env up --build --detach
```

8. Create the database.

````shell
docker exec -it vaults_php ./bin/console doctrine:migrations:migrate --env=dev
````

9. In other terminal windows you can monitor the server container as well as the frontend container with the following commands:

```shell
docker logs --follow vaults_nginx
```

```shell
docker logs --follow vaults_vue
```

That's it! Now you're ready to start developing!
