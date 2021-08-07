Getting started with Docker.

This project runs completely on Docker, there are three services being orchestrated with Docker Compose: db(MySQL), php(PHP 8.0 FPM) & nginx(NGINX 1.20 Alpine).

1. Copy the docker-compose.env.example and fill the variables out.

```shell
cp docker-compose.env.example docker-compose.env
```

2. Copy the NGINX config file and set your local hostname; also don't forget to add the hostname to your host's ```/etc/hosts```.

```shell
cp config/packages/dev/docker/nginx/default.conf.example config/packages/dev/docker/nginx/default.conf
```

3. Create the SSL certificate and its corresponding key for your hostname.

```shell
sudo openssl req -x509 \
                 -nodes \
                 -days 365 \
                 -newkey rsa:2048 \
                 -keyout /etc/ssl/private/selfsigned/site.key \
                 -out /etc/ssl/certs/selfsigned/site.crt
```

4. Copy the certificate + key in the project files for docker compose, 
and then import them in your preferred browser.

```shell
cp /etc/ssl/private/selfsigned/site.key config/packages/dev/docker/nginx/password-manager.key
cp /etc/ssl/private/selfsigned/site.crt config/packages/dev/docker/nginx/password-manager.crt
```

5. Build the images & create the containers with docker-compose.

```shell
docker-compose --env-file docker-compose.env up --build --detach
```

6. In your host filesystem start the front end running on Vue.js:

```shell
yarn watch
```

This will watch for changes made to the .js|.scss|.vue files and re-compile automatically.

7. In another terminal window you can monitor the NGINX container with the following command:

```shell
docker logs --follow password-manager_nginx
```

That's it! Now you're ready to start developing!
