# docker network create hw2-net
# docker run -d --name hw2-server --network hw2-net -p "3306:3306" -e "MYSQL_RANDOM_ROOT_PASSWORD=yes" -e "MYSQL_USER=hw2" -e "MYSQL_PASSWORD=admin123" -e "MYSQL_DATABASE=hw2" mysql

FROM node:16
WORKDIR /usr/src/app
COPY . .
RUN npm install
ENV PORT=8000
EXPOSE ${PORT}
CMD [ "npm", "start" ]