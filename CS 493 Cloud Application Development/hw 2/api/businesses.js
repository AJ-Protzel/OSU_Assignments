const { Router } = require('express')
const { ValidationError } = require('sequelize')
const router = Router()

const Business = require('../models/business')
const Photo = require('../models/photo')
const Review = require('../models/review')

router.get('/', async function (req, res, next){
  let page = parseInt(req.query.page) || 1
  const lastPage = Math.ceil(Business.length / numPerPage)
  page = page > lastPage ? lastPage : page
  page = page < 1 ? 1 : page
  const pageSize = 10
  const offset = (page - 1) * pageSize

  const result = await Business.findAndCountAll({
    limit: pageSize,
    offset: offset
  })
  const links = {}
  if(page < lastPage){
    links.nextPage = `/Business?page=${page + 1}`
    links.lastPage = `/Business?page=${lastPage}`
  }
  if(page > 1){
    links.prevPage = `/Business?page=${page - 1}`
    links.firstPage = '/Business?page=1'
  }
  res.status(200).send({
    businesses: result.rows,
    page: page,
    pageSize: pageSize,
    count: result.count,
    totalPages: Math.ceil(result.count / pageSize),
    links: links
  })
})

router.post('/', async function (req, res, next){
  try{
    const business = await Business.create(req.body, ['ownerid','name','address','city','state','zip','phone','category','subcategory','website','email'])
    console.log("== business:", business.toJSON())
    res.status(201).send({ id: business.id })
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

router.get('/:businessID', async function (req, res, next){
  const business = await Business.findByPk(id, {
    include: Review,
    include: Photo
  })
  if(business){
    res.status(200).send(business)
  } 
  else{
    next()
  }
})

router.patch('/:businessID', async function (req, res, next){
  const id = req.params.businessID
  const result = await Business.update(req.body, {
    where: { id: id },
    fields: ['ownerid','name','address','city','state','zip','phone','category','subcategory','website','email']
  })
  if(result[0] > 0){
    res.status(204).send()
  }
  else{
    next()
  }
})

router.delete('/:businessID', async function (req, res, next){
  const id = req.params.businessID
  const result = await Business.destroy({ where: { id: id }})
  if (result > 0) {
    res.status(204).send()
  } else {
    next()
  }
})

module.exports = router