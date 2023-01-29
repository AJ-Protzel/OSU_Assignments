const fs = require('fs')
const { ObjectId, GridFSBucket } = require('mongodb');

const { getDbReference } = require('../lib/mongo')
const Jimp = require('jimp');

/*
 * Schema describing required/optional fields of a photo object.
 */
const PhotoSchema = {
  businessId: { required: true },
  caption: { required: false }
}
exports.PhotoSchema = PhotoSchema

exports.saveImageFile = function (image, thumb) {
  return new Promise((resolve, reject) => {
    const db = getDbReference()
    const bucket = new GridFSBucket(db, { bucketName: 'images' })
    const metadata = {
      userId: image.userId,
      businessId: image.businessId,
      caption: image.caption,
      thumbId: thumb.id,
      mimetype: image.mimetype
    }
    const uploadStream = bucket.openUploadStream(image.filename, {
      metadata: metadata
    })
    fs.createReadStream(image.path).pipe(uploadStream)
      .on('error', function (err) {
        reject(err)
      })
      .on('finish', (result) => {
        console.log("== stream result:", result)
        resolve(result._id)
      })
  })
}

exports.saveThumbsFile = function (image) {
  return new Promise((resolve, reject) => {
    const db = getDbReference()
    Jimp.read('./path/to/image.jpg')
    .then(image => {
      image.resize(256, 256) // resize
      image.quality(60) // set JPEG quality
    })
    const bucket = new GridFSBucket(db, { bucketName: 'thumbs' })
    const metadata = {
      photoId: image.photoId
    }
    const uploadStream = bucket.openUploadStream(image.filename, {
      metadata: metadata
    })
    
    fs.createReadStream(image.path).pipe(uploadStream)
      .on('error', function (err) {
        reject(err)
      })
      .on('finish', (result) => {
        console.log("== stream result:", result)
        resolve(result._id)
      })
  })
}

exports.getImageInfoById = async function (id) {
  const db = getDbReference()
  const bucket = new GridFSBucket(db, { bucketName: 'images' })
  if (!ObjectId.isValid(id)) {
    return null
  } else {
    const results = await bucket.find({ _id: new ObjectId(id) })
      .toArray()
    return results[0]
  }
}

// exports.getImageDownloadStream = function(filename) {
//   const db = getDbReference()
//   const bucket = new GridFSBucket(db, { bucketName: 'images' })
//   return bucket.openDownloadStreamByName(filename)
// }

exports.getDownloadStreamByFilename = function (filename) {
  const db = getDbReference()
  const bucket = new GridFSBucket(db, { bucketName: 'images' })
  return bucket.openDownloadStreamByName(filename)
}

exports.getDownloadStreamById = function (id) {
  const db = getDbReference()
  const bucket = new GridFSBucket(db, { bucketName: 'images' })
  if (!ObjectId.isValid(id)) {
    return null
  } else {
    return bucket.openDownloadStream(new ObjectId(id))
  }
}

exports.updateImageTagsById = async function (id, tags) {
  const db = getDbReference()
  const collection = db.collection('images.files')
  if (!ObjectId.isValid(id)) {
    return null
  } else {
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { "metadata.tags": tags }}
    )
    return result.matchedCount > 0
  }
}