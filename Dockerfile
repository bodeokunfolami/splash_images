FROM node:12-slim

WORKDIR /usr/src/splash_images

COPY package.json yarn.lock ./

RUN yarn install --production=true

COPY . ./

CMD ["yarn", "start"]
