FROM mhart/alpine-node:10.11.0

WORKDIR /app
COPY . .

RUN yarn install --production

CMD ["yarn", "start"]
