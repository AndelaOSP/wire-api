FROM node

ARG DB_USER
ARG DB_PW
ARG DB_MACHINE
ARG DB_NAME
ENV NODE_ENV=development
ENV DATABASE_URL=postgres://postgres:postgres@wire-db:5432/wire_dev
ENV PORT=3000
ENV SECRET_KEY="somerandomcharacters@89"
ENV JWT_KEY=xxxx

RUN mkdir /wire

COPY start.sh /usr/local/bin

WORKDIR /wire

RUN chmod +x /usr/local/bin/start.sh

CMD [ "/usr/local/bin/start.sh" ]

