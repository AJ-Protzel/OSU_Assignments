const { Router } = require('express')
const router = Router()

router.use('/businesses', require('./businesses').router);
router.use('/reviews', require('./reviews').router);
router.use('/photos', require('./photos').router);
router.use('/users', require('./users').router);

module.exports = router