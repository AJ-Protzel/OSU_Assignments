const express = require('express')
const morgan = require('morgan')
const redis = require('redis')
const api = require('./api')
const { getDownloadStreamById } = require('./models/submission')
const { connectToDb } = require('./lib/mongo')
const { findAuth } = require("./lib/auth");

const app = express();
const port = process.env.PORT || 8000;
const redisUrl = process.env.REDIS_URL || 'redis://localhost'
console.log(`REDIS URL: ${redisUrl}`)
const redisClient = redis.createClient(
  {url: redisUrl})

async function rateLimit(req, res, next) {
  if(findAuth(req, req, next)){ // authed user
      const user = req.user
    let tokenBucket = await redisClient.hGetAll(user)
    console.log("== tokenBucket:", tokenBucket)

    const rateLimitMaxRequests = 30
    const rateLimitWindowMs = 1800000 // 30 minutes miliseconds

    if(tokenBucket){
      tokenBucket.tokens = parseFloat(tokenBucket.tokens)
    } else{
      tokenBucket = {
        tokens: rateLimitMaxRequests,
        last: Date.now()
      }
    }

    const now = Date.now()
    const ellapsedMs = now - tokenBucket.last
    tokenBucket.tokens += ellapsedMs * (rateLimitMaxRequests / rateLimitWindowMs)
    tokenBucket.tokens = Math.min(rateLimitMaxRequests, tokenBucket.tokens)
    tokenBucket.last = now
  
    if (tokenBucket.tokens >= 1) {
      tokenBucket.tokens -= 1
      await redisClient.hSet(ip, [['tokens', tokenBucket.tokens], ['last', tokenBucket.last]])
      next()
    } else {
      await redisClient.hSet(ip, [['tokens', tokenBucket.tokens], ['last', tokenBucket.last]])
      res.status(429).send({
        err: "Too many requests"
      })
    }
  }
  else{ // not authed
  const ip = req.ip
    let tokenBucket = await redisClient.hGetAll(ip)
    console.log("== tokenBucket:", tokenBucket)

    const rateLimitMaxRequests = 10
    const rateLimitWindowMs = 600000 // 10 minutes miliseconds

    if(tokenBucket){
      tokenBucket.tokens = parseFloat(tokenBucket.tokens)
    } else{
      tokenBucket = {
        tokens: rateLimitMaxRequests,
        last: Date.now()
      }
    }

    const now = Date.now()
    const ellapsedMs = now - tokenBucket.last
    tokenBucket.tokens += ellapsedMs * (rateLimitMaxRequests / rateLimitWindowMs)
    tokenBucket.tokens = Math.min(rateLimitMaxRequests, tokenBucket.tokens)
    tokenBucket.last = now
  
    if (tokenBucket.tokens >= 1) {
      tokenBucket.tokens -= 1
      await redisClient.hSet(ip, [['tokens', tokenBucket.tokens], ['last', tokenBucket.last]])
      next()
    } else {
      await redisClient.hSet(ip, [['tokens', tokenBucket.tokens], ['last', tokenBucket.last]])
      res.status(429).send({
        err: "Too many requests"
      })
    }
  }
}


app.use(morgan('dev'))
app.use(express.json())
app.use(express.static('public'))

app.use('/', api)
app.use(rateLimit)

// redis test
app.get('/', (req, res) => {
  res.status(200).json({
    timestamp: new Date().toString()
  });
});

app.get('/media/files/:filename', function (req, res, next) {
  const filename = req.params.filename
  if (filename == undefined) {
    return next()
  }
  const tmp = getDownloadStreamById(filename)
  if(tmp === null) next()  
  tmp.on('file', function (file) {
      res.status(200).type(file.metadata.mimetype)
    })
    .on('error', function (err) {
      if (err.code === 'ENOENT') {
        next()
      } else {
        next(err)
      }
    })
    .pipe(res)
})

// Catch for all non created resourses or for security
app.use('*', function (req, res, next) {
    res.status(404).json({
      error: "Requested resource " + req.originalUrl + " does not exist"
    })
})

// This is for any errors from the API 
app.use('*', function (err, req, res, next) {
    console.error("== Error:", err)
    res.status(500).send({
        err: "Server error.  Please try again later."
    })
  })

redisClient.connect().then(
  connectToDb(function () {
    app.listen(port, function() {
      console.log("== Server is running on port", port);
    }
  )}
))

// connectToDb(function () {
//     app.listen(port, function() {
//       console.log("== Server is running on port", port);
//     })
//   })