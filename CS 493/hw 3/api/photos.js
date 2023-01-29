const { Router } = require('express')
const { ValidationError } = require('sequelize')

const { Photo, PhotoClientFields } = require('../models/photo')

const { requireAuthentication } = require('../lib/auth')

const router = Router()

/*
 * Route to create a new photo.
 */
router.post('/', requireAuthentication, async function (req, res, next) {
  try {
    const photo = await Photo.create(req.body, PhotoClientFields)
    res.status(201).send({ id: photo.id })
  } catch (e) {
    if (e instanceof ValidationError) {
      res.status(400).send({ error: e.message })
    } else {
      throw e
    }
  }
})

/*
 * Route to fetch info about a specific photo.
 */
router.get('/:photoId', requireAuthentication, async function (req, res, next) {
  const user = await User.findOne({where: {id: req.user}})
  if(req.params.userId == req.user || user.admin == true){
    const photoId = req.params.photoId
    const photo = await Photo.findByPk(photoId)
    if (photo) {
      res.status(200).send(photo)
    } else {
      next()
    }
  } else {
    res.status(401).send({
        error: "Invalid credentials"
      })
  }
})

/*
 * Route to update a photo.
 */
router.patch('/:photoId', requireAuthentication, async function (req, res, next) {
  const user = await User.findOne({where: {id: req.user}})
  if(req.params.userId == req.user || user.admin == true){
    const photoId = req.params.photoId
    const result = await Photo.update(req.body, {
      where: { id: photoId },
      fields: PhotoClientFields.filter(
        field => field !== 'businessId' && field !== 'userId'
      )
    })
    if (result[0] > 0) {
      res.status(204).send()
    } else {
      next()
    }
  } else {
    res.status(401).send({
        error: "Invalid credentials"
      })
  }
})

/*
 * Route to delete a photo.
 */
router.delete('/:photoId', requireAuthentication, async function (req, res, next) {
  const user = await User.findOne({where: {id: req.user}})
  if(req.params.userId == req.user || user.admin == true){
    const photoId = req.params.photoId
    const result = await Photo.destroy({ where: { id: photoId }})
    if (result > 0) {
      res.status(204).send()
    } else {
      next()
    }
  } else {
    res.status(401).send({
        error: "Invalid credentials"
      })
  }
})

module.exports = router
