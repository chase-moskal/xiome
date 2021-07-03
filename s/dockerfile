
FROM node:15

RUN mkdir /app && mkdir /app/s
WORKDIR /app

COPY package*.json tsconfig.json ./
COPY x x

RUN npm install --production

CMD ["node", "./x/server.js"]
