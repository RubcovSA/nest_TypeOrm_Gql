FROM mysql:8.0

ENV MYSQL_ROOT_PASSWORD 123
ENV MYSQL_DATABASE CATALOG_DEV
ENV MYSQL_USER users_service_development
ENV MYSQL_PASSWORD 123

ADD setup.sql /docker-entrypoint-initdb.d
