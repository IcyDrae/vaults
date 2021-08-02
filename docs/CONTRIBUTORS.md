Getting started with docker

1.Copy the docker-compose.env.example and fill the variables out.

```shell
cp docker-compose.env.example docker-compose.env
```

2. Create the containers with docker-compose.

```shell
docker-compose --env-file docker-compose.env up --build --detach
```

3. Monitor the NGINX container with the following command.

```shell
docker logs --follow password-manager_nginx
```
