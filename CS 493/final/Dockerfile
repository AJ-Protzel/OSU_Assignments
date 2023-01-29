FROM node:16
WORKDIR /usr/src/app
COPY . .
RUN npm install
ENV PORT=9000
EXPOSE ${PORT}
CMD [ "npm", "start" ]