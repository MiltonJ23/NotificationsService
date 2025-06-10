FROM node:latest AS base

WORKDIR /app

COPY Src/package*.json ./

RUN npm ci --only=production

COPY Src/ .

EXPOSE 4500

CMD [ "node", "index.js" ]