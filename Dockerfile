FROM node:16-alpine

ARG MAX_OLD_SPACE_SIZE=2048

ENV NODE_OPTIONS=--max-old-space-size=${MAX_OLD_SPACE_SIZE}

WORKDIR /workspace

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 8080

CMD npm run start
