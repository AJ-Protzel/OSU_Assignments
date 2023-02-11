const { Router } = require('express')
const multer = require('multer')
const crypto = require('crypto')
const fs = require('fs/promises')

const { validateAgainstSchema } = require('../lib/validation')
const { getChannel } = require('../lib/rabbitmq')
// const { postMain } = require('../producer')
// const { getMain } = require('../consumer')
// const { queue } = require('../server.js')
const queue = 'images'

const {
  PhotoSchema,
  saveImageFile,
  getImageInfoById,
  getDownloadStreamByFilename
} = require('../models/photo')

const router = Router()

const fileTypes = {
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/jpeg': 'jpeg'
}

const upload = multer({
  storage: multer.diskStorage({
    destination: `${__dirname}/uploads`,
    filename: function (req, file, callback) {
      const ext = fileTypes[file.mimetype]
      const filename = crypto.pseudoRandomBytes(16).toString('hex')
      callback(null, `${filename}.${ext}`)
    }
  }),
  fileFilter: function (req, file, callback) {
    callback(null, !!fileTypes[file.mimetype])
  }
})

router.get('/', (req, res, next) => {
  res.status(200).sendFile(__dirname + '/index.html');
});


/*
 * POST /photos - Route to create a new photo.
 */
router.post('/', upload.single('image'), async function (req, res, next) {
  console.log("== req.file:", req.file)
  console.log("== req.body:", req.body)

  if (validateAgainstSchema(req.body, PhotoSchema)) {
    try {
      const image = {
        userId: req.body.userId,
        businessId: req.body.businessId,
        caption: req.body.caption,
        thumbsId: req.body.thumbsId,
        path: req.file.path,
        filename: req.file.filename,
        mimetype: req.file.mimetype
      }
      const thumb = await saveThumbsFile(image)
      const id = await saveImageFile(image, thumb)
      await fs.unlink(req.file.path)

      const channel = getChannel()
      channel.sendToQueue(queue, Buffer.from(id.toString()))

      res.status(200).send({ id: id })
    } catch (err) {
      console.error(err)
      res.status(500).send({
        error: "Error inserting image into DB.  Please try again later."
      })
    }
  } else {
    res.status(400).send({
      error: "Request body is not a valid image object"
    })
  }
})

/*
 * GET /photos/{id} - Route to fetch info about a specific photo.
 */
router.get('/:id', async (req, res, next) => {
  try {
    const image = await getImageInfoById(req.params.id);
    if (image) {
      const resBody = {
        _id: image._id,
        url: `/media/images/${image.filename}`,
        mimetype: image.metadata.mimetype,
        userId: image.metadata.userId,
        tags: image.metadata.tags
      }
      res.status(200).send(resBody);
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
})

/*
 * GET /photos/media/images/{filename} - Route to download a specific photo.
 */
router.get('/media/images/:filename', function (req, res, next) {
  getDownloadStreamByFilename(req.params.filename)
  .on('error', (err) => {
    if (err.code === 'ENOENT') {
      next()
    } else {
      next(err)
    }
  })
  .on('file', (file) => {
    res.status(200).type(file.metadata.contentType)
  })
  .pipe(res)
})

module.exports = router
