FROM node:16

WORKDIR /usr/src/app

ENV NODE_CONFIG_DIR=./src/config

# Install app dependencies
COPY package.json ./

RUN yarn install

# Bundle app source
COPY . .
RUN yarn build -v 
RUN yarn build

EXPOSE 8080
CMD [ "yarn", "start:prod" ]