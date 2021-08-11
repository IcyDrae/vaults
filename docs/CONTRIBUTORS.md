Getting started with Docker.

This project runs completely on Docker, there are four services being orchestrated with Docker Compose: db(MySQL), php(PHP 8.0 FPM), api(NGINX 1.20 Alpine) & spa(Vue.js frontend).

1. Copy the docker-compose.env.example and fill the variables out.

```shell
cp docker-compose.env.example docker-compose.env
```

2. Copy the NGINX & Xdebug config files and set your local hostname; also don't forget to add the hostname to your host's ```/etc/hosts``` and the Xdebug port.

```shell
cp config/packages/dev/docker/api/default.conf.example config/packages/dev/docker/api/default.conf
cp config/packages/dev/docker/php/conf.d/docker-php-ext-debug.ini.example config/packages/dev/docker/php/conf.d/docker-php-ext-debug.ini
```

3. Copy the frontend config file and set the variables:

The frontend files reside under ``` web```, completely separated and independent of Symfony and Twig etc.

```shell
cp web/.env.development.local.example web/.env.development.local
```

4. Create the SSL certificate and its corresponding key for your hostname.

```shell
sudo openssl req -x509 \
                 -nodes \
                 -days 365 \
                 -newkey rsa:2048 \
                 -keyout /etc/ssl/private/selfsigned/site.key \
                 -out /etc/ssl/certs/selfsigned/site.crt
```

5. Copy the certificate + key in the project files for docker compose, 
and then import them in your preferred browser.

```shell
cp /etc/ssl/private/selfsigned/site.key config/packages/dev/docker/api/password-manager.key
cp /etc/ssl/private/selfsigned/site.crt config/packages/dev/docker/api/password-manager.crt
```

6. Build the images & create the containers with docker-compose.

```shell
docker-compose --env-file docker-compose.env up --build --detach
```

8. In other terminal windows you can monitor the api container as well as the frontend container with the following commands:

```shell
docker logs --follow password-manager_api
```

```shell
docker logs --follow password-manager_spa
```

That's it! Now you're ready to start developing!
