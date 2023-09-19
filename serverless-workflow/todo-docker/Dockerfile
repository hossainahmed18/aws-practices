#pulling the base image from docker hub
FROM node:alpine


#creating a work directory in docker container
WORKDIR /app


#This will prevent unncessarily runing "npm install" if there is no change in pachage.json file
COPY package*.json .


#this will install all dependencies in docker image file system
RUN npm install


#This will copy rest of the file
COPY . ./


#This will run in CMD and it will react app in docker container
CMD npm start

EXPOSE 3000

