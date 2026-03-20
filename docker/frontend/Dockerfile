FROM node:lts-alpine

WORKDIR /var/www/vaults_frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/. .

CMD ["npm", "run", "serve"]
