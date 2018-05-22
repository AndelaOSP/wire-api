FROM node:carbon

LABEL maintainer="Thomas Nyambati <thomas.nyambati@andela.com>"

LABEL app="wire-backend"

WORKDIR /app

COPY scripts/dev.sh /usr/local/bin/dev.sh
RUN chmod +x /usr/local/bin/dev.sh

ADD src /app

RUN yarn install

ENTRYPOINT [ "dev.sh" ]
