# docker build -t hw1-api .
# docker image ls
# docker run -d --name hw1-api -p 8000:8000 hw1-api
# key: 18636fcd44112c1ab5ad68d0680c04bab8e267c17072538f2dc81035f31e0d9f

FROM node:16
WORKDIR /usr/src/app
COPY . .
RUN npm install
ENV PORT=8000
EXPOSE ${PORT}
CMD [ "npm", "start" ]
