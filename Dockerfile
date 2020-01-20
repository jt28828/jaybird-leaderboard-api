FROM node:lts-alpine

WORKDIR /usr/src/app
COPY . .

RUN npm install
RUN npm run build

EXPOSE 5050 4001
CMD ["npm", "run", "start:prod"]
