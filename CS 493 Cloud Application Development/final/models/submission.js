/*
 * SubmissionSchema schema and data accessor methods
 */

const { ObjectId, GridFSBucket } = require('mongodb')
const fs = require('fs')
const { getDbInstance } = require('../lib/mongo')
const { extractValidFields } = require('../lib/valid')

/*
 * Schema describing required/optional fields of a submission object.
 */
const SubmissionSchema = {
    assignmentId: { required: true },
    studentId: { required: true},
    timestamp: { required: true},
    grade: { required: false },
    // file: { required: true },
}

exports.SubmissionSchema = SubmissionSchema


async function getAllAssignmentSubmissions(assignmentId,studentId) {
  console.log(`StudentID: ${studentId}, asnId: ${assignmentId} typeof asnid: ${typeof assignmentId}`)
  const db = getDbInstance()
  const collection = db.collection('submissions.files')
  let findQuery = {
    "metadata.assignmentId": assignmentId,
  }
  if (studentId !== undefined) {
    findQuery["metadata.studentId"] = studentId
  }
  console.log(await collection.find({}).toArray())
  return await collection.find(findQuery).toArray()
}
exports.getAllAssignmentSubmissions = getAllAssignmentSubmissions

/*
 * Executes a DB query to insert a new Submission into the database.  Returns
 * a Promise that resolves to the ID of the newly-created Submission entry.
 */
function insertNewSubmission(submission) {
  return new Promise(function (resolve, reject) {
    const db = getDbInstance()
    const bucket = new GridFSBucket(db, { bucketName: 'submissions' })
    const metadata = {
      mimetype: submission.mimetype,
      studentId: submission.studentId,
      assignmentId: submission.assignmentId,
      timestamp: submission.timestamp,
    }
    const uploadStream = bucket.openUploadStream(submission.filename, {
      metadata: metadata
    })
    fs.createReadStream(submission.path).pipe(uploadStream)
      .on('error', function (err) {
        reject(err)
      })
      .on('finish', function (result) {
        console.log("== stream result:", result)
        resolve(result._id)
      })
  })
}
exports.insertNewSubmission = insertNewSubmission

exports.getDownloadStreamById = function (id) {
  const db = getDbInstance()
  const bucket = new GridFSBucket(db, { bucketName: 'submissions' })
  if (!ObjectId.isValid(id)) {
    return null
  } else {
    return bucket.openDownloadStream(new ObjectId(id))
  }
}

exports.updateSubmissionFileLinkById = async function (id, file) {
  console.log("adding file link: ",file)
  const db = getDbInstance()
  const collection = db.collection('submissions.files')
  if (!ObjectId.isValid(id)) {
    return null
  } else {
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { "metadata.file": file }}
    )
    return result.matchedCount > 0
  }
}

