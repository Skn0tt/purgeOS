FROM node:12

WORKDIR /app

ADD package.json yarn.lock ./

RUN yarn

ADD src ./src/
ADD bin ./bin/
ADD tsconfig.json ./

RUN yarn build

ENV NODE_ENV production

CMD ./bin/run