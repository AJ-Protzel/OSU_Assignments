const { Router } = require('express')
const router = Router()

const { businesses } = require('./businesses');
const { reviews } = require('./reviews');
const { photos } = require('./photos');

/*
 * Route to list all of a user's businesses.
 */
router.get('/:userID/businesses', async function (req, res) {
  const userID = parseInt(req.params.userID);
  const userBusinesses = businesses.filter(business => business && business.ownerID === userID);
  res.status(200).json({
    businesses: userBusinesses
  });
});

/*
 * Route to list all of a user's reviews.
 */
router.get('/:userID/reviews', async function (req, res) {
  const userID = parseInt(req.params.userID);
  const userReviews = reviews.filter(review => review && review.userID === userID);
  res.status(200).json({
    reviews: userReviews
  });
});

/*
 * Route to list all of a user's photos.
 */
router.get('/:userID/photos', async function (req, res) {
  const userID = parseInt(req.params.userID);
  const userPhotos = photos.filter(photo => photo && photo.userID === userID);
  res.status(200).json({
    photos: userPhotos
  });
});

exports.router = router