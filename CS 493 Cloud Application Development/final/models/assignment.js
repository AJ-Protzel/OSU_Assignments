const { verifyAdmin, requireAuth } = require('../lib/auth')
const { ObjectId } = require('mongodb')
const { getDbInstance } = require('../lib/mongo')
const { validateAgainstSchema, extractValidFields } = require('../lib/valid')
const { SubmissionSchema, insertNewSubmission } = require("../models/submission")

const AssignmentSchema = {
    courseId: { required: true },
    title: { required: true},
    points: { required: true},
    due: { required: true }
}
exports.AssignmentSchema = AssignmentSchema

async function insertNewAssignment(assignment) {
    const inserting = extractValidFields(assignment, AssignmentSchema)
    const db = getDbInstance()
    const collection = db.collection('assignments')
    console.log("== Attempting to insert 'assignment':\n", assignment)
    const result = await collection.insertOne(inserting)
    return result.insertedId
}
exports.insertNewAssignment = insertNewAssignment

async function deleteAssignmentById(id) {
    const db = getDbInstance()
    const collection = db.collection('assignments')
    console.log("== Attempting to delete 'assignment' by id: ", id)
    const result = await collection.deleteOne({
        _id: new ObjectId(id)
    })
      return result.deletedCount > 0
}
exports.deleteAssignmentById = deleteAssignmentById

async function patchAssignmentById(id, request) {
    const db = getDbInstance()
    const collection = db.collection('assignments')
    console.log("== Attempting to patch 'assignment' by id: ", id)

    const assignmentValues = {
        courseId: request.courseId,
        title: request.title,
        points: request.points,
        due: request.due
    }

    const result = await collection.replaceOne(
        {_id: new ObjectId(id) },
        assignmentValues
      )
      return result.matchedCount > 0
}
exports.patchAssignmentById = patchAssignmentById

async function getAssignmentById(id) {
    const db = getDbInstance()
    const collection = db.collection('assignments')
    console.log("== Attempting to lookup 'assignment' by id: ", id)
    const results = await collection.aggregate([
        { $match: {
            _id: new ObjectId(id)
          }}
    ]).toArray()
    if (results.length == 0) {
        return false
    }
    return results[0]
}
exports.getAssignmentById = getAssignmentById

async function bulkInsertNewAssignments(assignments) {
    const assignmentsToInsert = assignments.map(function (assignment) {
        return extractValidFields(assignment, AssignmentSchema)
    })
    const db = getDbInstance()
    const collection = db.collection('assignments')
    const result = await collection.insertMany(assignmentsToInsert)
    return result.insertedIds
}
exports.bulkInsertNewAssignments = bulkInsertNewAssignments