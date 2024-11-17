# desired version node:<version>
FROM node:22-alpine

WORKDIR /nodejs-service

# what copy - where
COPY package*.json .
RUN npm install

# copy the rest files of app
COPY . .

# application's default port
EXPOSE 4000

# typeorm config vatiables
ENV DB_HOST=postgres \
    DB_PORT=5432 \
    DB_USERNAME=postgres \
    DB_PASSWORD=halynavs89 \
    DB_DATABASE=home \
    DB_SYNCHRONIZE=true \ 
    DB_LOGGING=true 

RUN command
 
CMD [ "npm", "run", "start:dev" ]