FROM mhart/alpine-node:10.11.0

WORKDIR /app

COPY package.json .
COPY yarn.lock .
RUN yarn install --production

COPY . .

CMD ["sh", "forever.sh"]
