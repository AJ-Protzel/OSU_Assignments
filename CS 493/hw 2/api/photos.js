const { Router } = require('express')
const { ValidationError } = require('sequelize')
const router = Router()

const Photo = require('../models/photo')

router.post('/', async function (req, res, next){
  try {
    const Photo = await Photo.create(req.body, ['userID','photoID','caption'])
    console.log("== photo:", photo.toJSON())
    res.status(201).send({ id: photo.id })
  } 
  catch(e){
    if(e instanceof ValidationError){
      res.status(400).send({
        err: e.message
      })
    } 
    else{
      throw e
    }
  }
})

router.get('/:photoID', async function (req, res, next){
  const id = req.params.id
  const lodging = await Lodging.findAll({
    where: { id: id }
  })
  if(photo){
    res.status(200).send(photo)
  } 
  else{
    next()
  }
})

router.patch('/:photoID', async function (req, res, next){
  const id = req.params.photoID
  const result = await Photo.update(req.body, {
    where: { id: id },
    fields: ['userID','photoID','caption']
  })
  if(result[0] > 0){
    res.status(204).send()
  }
  else{
    next()
  }
})

router.delete('/:photoID', async function (req, res, next){
  const id = req.params.photoID
  const result = await Photo.destroy({ where: { id: id }})
  if (result > 0) {
    res.status(204).send()
  } else {
    next()
  }
})

module.exports = router