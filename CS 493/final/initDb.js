/*
 * This file contains a simple script to populate the database with initial
 * data from the files in the data/ directory.  The following environment
 * variables must be set to run this script:
 *
 *   MONGO_DB_NAME - The name of the database into which to insert data.
 *   MONGO_USER - The user to use to connect to the MongoDB server.
 *   MONGO_PASSWORD - The password for the specified user.
 *   MONGO_AUTH_DB_NAME - The database where the credentials are stored for
 *     the specified user.
 *
 * In addition, you may set the following environment variables to create a
 * new user with permissions on the database specified in MONGO_DB_NAME:
 *
 *   MONGO_CREATE_USER - The name of the user to create.
 *   MONGO_CREATE_PASSWORD - The password for the user.
 */

const { connectToDb, getDbInstance, closeDbConnection } = require('./lib/mongo')
const { bulkInsertNewAssignments } = require('./models/assignment')
const { bulkInsertNewCourses } = require('./models/course')
const { bulkInsertNewUsers, insertNewUser } = require('./models/user')

const assignmentData = require('./data/assignments.json')
const courseData = require('./data/courses.json')
const userData = require('./data/users.json')

const mongoCreateUser = process.env.MONGO_CREATE_USER
const mongoCreatePassword = process.env.MONGO_CREATE_PASSWORD

const AdminUser = {
  name: "admin",
  email: "admin@admin.com",
  password: "hunter2",
  role: "admin"
}

connectToDb(async function () {
  const id1 = await bulkInsertNewAssignments(assignmentData)
  console.log("== Inserted assignments with IDs:", id1)

  const id2 = await bulkInsertNewCourses(courseData)
  console.log("== Inserted courses with IDs:", id2)

  const id3 = await bulkInsertNewUsers(userData)
  console.log("== Inserted users with IDs:", id3)

  /*
   * Create a new, lower-privileged database user if the correct environment
   * variables were specified.
   */
  if (mongoCreateUser && mongoCreatePassword) {
    const db = getDbInstance()
    const result = await db.addUser(mongoCreateUser, mongoCreatePassword, {
      roles: "readWrite"
    })
    console.log("== New user created:", result)
  }
  const adminId = await insertNewUser(AdminUser)
  console.log(`== Inserted admin ${adminId}`)
  closeDbConnection(function () {
    console.log("== DB connection closed")
  })
})
