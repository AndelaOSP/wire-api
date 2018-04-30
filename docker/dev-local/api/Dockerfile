FROM node

ENV NODE_ENV=development
ENV DATABASE_URL=postgres://postgres:postgres@wire-db:5432/wire_dev
ENV PORT=3000
ENV SECRET_KEY="somerandomcharacters@89"
ENV JWT_KEY=xxxx
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres

# for this local dev environment, the command below shud be a COPY or ADD
RUN git clone https://github.com/AndelaOSP/wire-api.git

WORKDIR /wire-api

ADD /start.sh /wire-api

RUN chmod +x start.sh

CMD [ "./start.sh" ]

