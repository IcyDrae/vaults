## How to install

This software runs completely on Docker, there are four services being orchestrated with Docker Compose:
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

9. You can also monitor the other containers like so:

```shell
docker logs --follow vaults_nginx
```

That's it! Now you have an instance of vaults running!
