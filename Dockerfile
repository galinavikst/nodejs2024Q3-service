# desired version node:<version>
FROM node:22-alpine

WORKDIR /nodejs-service

# what copy - where
COPY package*.json ./
RUN npm install

# copy the rest files of app
COPY . .

# application's default port
EXPOSE 5432

CMD [ "npm", "start" ]