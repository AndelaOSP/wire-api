FROM postgres:alpine

ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres

ADD createdb.sql /docker-entrypoint-initdb.d

EXPOSE 5432

