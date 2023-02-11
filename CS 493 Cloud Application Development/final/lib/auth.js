const jwt = require('jsonwebtoken')
// const redis = require('redis')

const { getDbInstance } = require('../lib/mongo')
const { ObjectId } = require('mongodb')
// const { redisClient } = require("../server.js");

const secret = "finalproject"
// const redisHost = process.env.REDIS_HOST
// const redisPort = process.env.REDIS_PORT || 6379
// const redisClient = redis.createClient(redisHost, redisPort)

function generateAuthToken(userId) {
    const payload = { sub: userId }
    return jwt.sign(payload, secret, { expiresIn: '24h' })
}
exports.generateAuthToken = generateAuthToken

function requireAuth(req, res, next) {
    const authHeader = req.get('authorization') || ''
    const authParts = authHeader.split(' ')
    const token = authParts[0] === 'Bearer' ? authParts[1] : null
    try { // valid // 30 per min per user
        const payload = jwt.verify(token, secret)
        req.user = payload.sub
        next()
        // return true
    }
    catch(err) { // none or invalid // 10 per min per ip
        next()
        // return false
    }
}
exports.requireAuth = requireAuth

function findAuth(req, res, next) {
    const authHeader = req.get('authorization') || ''
    const authParts = authHeader.split(' ')
    const token = authParts[0] === 'Bearer' ? authParts[1] : null
    try { // valid // 30 per min per user
        const payload = jwt.verify(token, secret)
        req.user = payload.sub
        // next()
        return true
    }
    catch(err) { // none or invalid // 10 per min per ip
        // next()
        return false
    }
}
exports.findAuth = findAuth

async function verifyAdmin(id) {
    const db = getDbInstance()
    const collection = db.collection('users')
    console.log("== Attempting to lookup 'user' by id: ", id)
    if (!ObjectId.isValid(id)) {
        return null
    } 
    else {
        const results = await collection
            .find({ _id: new ObjectId(id) })
            .toArray()
        console.log("== User that is logged in: ", results[0])
        if(typeof(results[0]) === 'undefined') return false
        if (results[0].role === 'admin') {
          return true
        }
        else {
          return false
        }
    }
}
exports.verifyAdmin = verifyAdmin

// async function rateLimit(req, res, next) {
//     if(findAuth(req, req, next)){ // authed user
//         const user = req.user
//       let tokenBucket = await redisClient.hGetAll(user)
//       console.log("== tokenBucket:", tokenBucket)
  
//       const rateLimitMaxRequests = 30
//       const rateLimitWindowMs = 1800000 // 30 minutes miliseconds
  
//       if(tokenBucket){
//         tokenBucket.tokens = parseFloat(tokenBucket.tokens)
//       } else{
//         tokenBucket = {
//           tokens: rateLimitMaxRequests,
//           last: Date.now()
//         }
//       }
  
//       const now = Date.now()
//       const ellapsedMs = now - tokenBucket.last
//       tokenBucket.tokens += ellapsedMs * (rateLimitMaxRequests / rateLimitWindowMs)
//       tokenBucket.tokens = Math.min(rateLimitMaxRequests, tokenBucket.tokens)
//       tokenBucket.last = now
    
//       if (tokenBucket.tokens >= 1) {
//         tokenBucket.tokens -= 1
//         await redisClient.hSet(ip, [['tokens', tokenBucket.tokens], ['last', tokenBucket.last]])
//         next()
//       } else {
//         await redisClient.hSet(ip, [['tokens', tokenBucket.tokens], ['last', tokenBucket.last]])
//         res.status(429).send({
//           err: "Too many requests"
//         })
//       }
//     }
//     else{ // not authed
//     const ip = req.ip
//       let tokenBucket = await redisClient.hGetAll(ip)
//       console.log("== tokenBucket:", tokenBucket)
  
//       const rateLimitMaxRequests = 10
//       const rateLimitWindowMs = 600000 // 10 minutes miliseconds
  
//       if(tokenBucket){
//         tokenBucket.tokens = parseFloat(tokenBucket.tokens)
//       } else{
//         tokenBucket = {
//           tokens: rateLimitMaxRequests,
//           last: Date.now()
//         }
//       }
  
//       const now = Date.now()
//       const ellapsedMs = now - tokenBucket.last
//       tokenBucket.tokens += ellapsedMs * (rateLimitMaxRequests / rateLimitWindowMs)
//       tokenBucket.tokens = Math.min(rateLimitMaxRequests, tokenBucket.tokens)
//       tokenBucket.last = now
    
//       if (tokenBucket.tokens >= 1) {
//         tokenBucket.tokens -= 1
//         await redisClient.hSet(ip, [['tokens', tokenBucket.tokens], ['last', tokenBucket.last]])
//         next()
//       } else {
//         await redisClient.hSet(ip, [['tokens', tokenBucket.tokens], ['last', tokenBucket.last]])
//         res.status(429).send({
//           err: "Too many requests"
//         })
//       }
//     }
//   }
//   exports.rateLimit = rateLimit