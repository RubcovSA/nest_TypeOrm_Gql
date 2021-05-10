FROM node:12.16.2

# Create app directory
WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./

RUN yarn

COPY . .
RUN yarn build
EXPOSE 3000

RUN chmod 755 ./
CMD ["yarn", "start:dev"]
