FROM node:carbon

LABEL AUTHOR="Thomas Nyambati <thomas.nyambati@andela.com>"
LABEL app="wire-backend"

WORKDIR /app

COPY src/package.json /app/package.json
COPY src/yarn.lock /app/yarn.lock
COPY src/.sequelizerc /app/.sequelizerc

RUN yarn install

COPY src /app

CMD [ "bin/www" ]
