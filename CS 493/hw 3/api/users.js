const { Router } = require('express')
const { ValidationError } = require('sequelize')
const bcrypt = require('bcryptjs')

const { Business } = require('../models/business')
const { Photo } = require('../models/photo')
const { Review } = require('../models/review')
const { User, UserClientFields } = require('../models/user')

const { generateAuthToken, requireAuthentication } = require('../lib/auth')

const router = Router()

router.post('/', requireAuthentication, async function (req, res, next) {
  if(req.body.admin == true){ // if trying to make admin account
    const user = await User.findOne({where: {id: req.user}})
    if(user){ // check if current account is admin
      try {
        req.body.password = await bcrypt.hash(req.body.password, 8)
        const user = await User.create(req.body, UserClientFields)
        aUser = requireAuthentication(user)
        if(user.admin == true && aUser.admin == true){
          res.status(201).send({ newUser: user })
        }else {
          res.status(401).send({
            error: "Invalid credentials"
          })
        }
      } catch (e) {
        if (e instanceof ValidationError) {
          res.status(400).send({ error: e.message })
        } else {
          throw e
        }
      }
    } else{
      res.status(401).send({
        error: "Invalid credentials"
      })
    }
  } else{ // not creating admin account
    try {
      req.body.password = await bcrypt.hash(req.body.password, 8)
      const user = await User.create(req.body, UserClientFields)
      aUser = requireAuthentication(user)
      if(user.admin == true && aUser.admin == true){
        res.status(201).send({ newUser: user })
      }else {
        res.status(401).send({
          error: "Invalid credentials"
        })
      }
    } catch (e) {
      if (e instanceof ValidationError) {
        res.status(400).send({ error: e.message })
      } else {
        throw e
      }
    }
  }
}) 

router.post('/login', async function (req, res, next) {
  if (req.body && req.body.email && req.body.password) {
    const user = await User.findOne({where: {email: req.body.email}})
    const authenticated = user && await bcrypt.compare(req.body.password, user.password)
    if (authenticated) {
      const token = generateAuthToken(req.body.id)
      res.status(200).send(token)
    } else {
      res.status(401).send({
        error: "Invalid credentials"
      })
    }
  } else {
    res.status(400).send({
      error: "Request needs user email and password."
    })
  }
})

router.get('/:userId', requireAuthentication, async function (req, res, next) {
  const user = await User.findOne({where: {id: req.params.userId}})
  if (user) {
    res.status(200).send(user)
  } else {
    next()
  }
})

/*
 * Route to list all of a user's businesses.
 */
router.get('/:userId/businesses', requireAuthentication, async function (req, res) {
  const user = await User.findOne({where: {id: req.user}})
  if(req.params.userId == req.user || user.admin == true){
    const userId = req.params.userId
    const userBusinesses = await Business.findAll({ where: { ownerId: userId }})
    res.status(200).json({
      businesses: userBusinesses
    })
  } else {
    res.status(401).send({
      error: "Invalid credentials"
    })
  }
})

/*
 * Route to list all of a user's reviews.
 */
router.get('/:userId/reviews', requireAuthentication, async function (req, res) {
  const user = await User.findOne({where: {id: req.user}})
  if(req.params.userId == req.user || user.admin == true){
    const userId = req.params.userId
    const userReviews = await Review.findAll({ where: { userId: userId }})
    res.status(200).json({
      reviews: userReviews
    })
  } else {
    res.status(401).send({
      error: "Invalid credentials"
    })
  }
})

/*
 * Route to list all of a user's photos.
 */
router.get('/:userId/photos', requireAuthentication, async function (req, res) {
  const user = await User.findOne({where: {id: req.user}})
  if(req.params.userId == req.user || user.admin == true){
    const userId = req.params.userId
    const userPhotos = await Photo.findAll({ where: { userId: userId }})
    res.status(200).json({
      photos: userPhotos
    })
  } else {
    res.status(401).send({
      error: "Invalid credentials"
    })
  }
})

// // list all users
// router.get('/', requireAuthentication, async function (req, res) {
//   if(req.user){
//     let page = parseInt(req.query.page) || 1
//     page = page < 1 ? 1 : page
//     const numPerPage = 10
//     const offset = (page - 1) * numPerPage
//     const result = await User.findAndCountAll({
//       limit: numPerPage,
//       offset: offset
//     })
//     const lastPage = Math.ceil(result.count / numPerPage)
//     const links = {}
//     if (page < lastPage) {
//       links.nextPage = `/users?page=${page + 1}`
//       links.lastPage = `/users?page=${lastPage}`
//     }
//     if (page > 1) {
//       links.prevPage = `/users?page=${page - 1}`
//       links.firstPage = '/users?page=1'
//     }
//     res.status(200).json({
//       users: result.rows,
//       pageNumber: page,
//       totalPages: lastPage,
//       pageSize: numPerPage,
//       totalCount: result.count,
//       links: links
//     })
//   } else {
//       res.status(401).send({user: req.user
//     })
//   }
// })

module.exports = router