const { Router } = require('express')
const { ValidationError } = require('sequelize')
const router = Router()

const Review = require('../models/review')

router.post('/', async function (req, res, next){
  try{
    const review = await Review.create(req.body, ['userID','reviewID','dollars','stars','review'])
    console.log("== review:", review.toJSON())
    res.status(201).send({ id: review.id })
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

router.get('/:reviewID', async function (req, res, next){
  const id = req.params.id
  const lodging = await Lodging.findAll({
    where: { id: id }
  })
  if(review){
    res.status(200).send(review)
  } 
  else{
    next()
  }
})

router.patch('/:reviewID', async function (req, res, next){
  const id = req.params.reviewID
  const result = await Review.update(req.body, {
    where: { id: id },
    fields: ['userID','reviewID','dollars','stars','review']
  })
  if(result[0] > 0){
    res.status(204).send()
  }
  else{
    next()
  }
})

router.delete('/:reviewID', async function (req, res, next){
  const id = req.params.reviewID
  const result = await Review.destroy({ where: { id: id }})
  if (result > 0) {
    res.status(204).send()
  } else {
    next()
  }
})

module.exports = router