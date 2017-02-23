# docker-simple-webserver
Simple Nativ NodeJS Webserver & RestFul WebUI

### Run Server

```
node server.js
````
### Run Server Port 8080
```
node server.js 8080
````
# Docker

### Build your Docker-Image
```
docker build -t <your username>/node-simple-webserver .
```
### Run the Docker-Image with own public folder
```
docker run -p 3000:3000 --user nodejs -v /<local path to>/public:/usr/src/app/public --name webserver -d <your username>/node-simple-webserver
```
### Enter the Docker-Container
```
docker exec -it <container id> /bin/bash
```
