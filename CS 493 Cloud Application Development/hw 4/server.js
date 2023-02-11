// // docker pull mongo
// // docker pull rabbitmq
// // npm i multer

// // docker run -d --name hw4 --network mongo-net -p "27017:27017" -e "MONGO_INITDB_ROOT_USERNAME=root" -e "MONGO_INITDB_ROOT_PASSWORD=hunter2" mongo:latest
// // docker run -d --name hw4-rmq -p "5672:5672" -p "15672:15672" rabbitmq:management

// // // docker run --rm -it --network mongo-net mongo:latest mongo --host hw4 --username root --password hunter2 --authenticationDatabase admin
// // db.createUser({
// //   user: "root",
// //   pwd: "hunter2",
// //   roles: [ { role: "readWrite", db: "hw4" } ]
// // });

// // http://localhost:15672/
// // // user + pass = guest



// docker start hw4
// export MONGO_DB_NAME=hw4
// export MONGO_USER=root
// export MONGO_PASSWORD=hunter2
// export MONGO_HOST=localhost
// export MONGO_AUTH_DB_NAME=admin
// npm run dev

const express = require('express')
const morgan = require('morgan')

const api = require('./api')
const { connectToDb } = require('./lib/mongo')
const { connectToRabbitMQ } = require('./lib/rabbitmq')

const queue = 'images'

const app = express()
const port = process.env.PORT || 8000

/*
 * Morgan is a popular logger.
 */
app.use(morgan('dev'))

app.use(express.json())
app.use(express.static('public'))

/*
 * All routes for the API are written in modules in the api/ directory.  The
 * top-level router lives in api/index.js.  That's what we include here, and
 * it provides all of the routes.
 */
app.use('/', api)

app.use('*', function (req, res, next) {
  res.status(404).json({
    error: "Requested resource " + req.originalUrl + " does not exist"
  })
})

connectToDb(async () => {
  await connectToRabbitMQ(queue)
  app.listen(port, () => {
    console.log("== Server is running on port", port)
  })
})
