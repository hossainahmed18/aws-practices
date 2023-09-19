FROM node:alpine
WORKDIR /app
RUN apk add ffmpeg
COPY package.json .
RUN npm install
COPY  . ./
CMD npm run compressVideo