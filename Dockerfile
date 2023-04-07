FROM node:16-alpine

WORKDIR /fetch

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "node", "dist/src/main.js" ]