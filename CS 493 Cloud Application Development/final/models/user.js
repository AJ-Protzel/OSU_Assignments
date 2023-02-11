const bcrypt = require("bcryptjs");

const { verifyAdmin, generateAuthToken, requireAuth } = require("../lib/auth");
const { ObjectId } = require("mongodb");
const { getDbInstance } = require("../lib/mongo");
const { validateAgainstSchema, extractValidFields } = require("../lib/valid");

const UserSchema = {
  name: { required: true },
  email: { required: true },
  password: { required: true },
  role: { required: true },
};

const LoginSchema = {
  email: { required: true },
  password: { required: true },
};

exports.LoginSchema = LoginSchema;
exports.UserSchema = UserSchema;

async function insertNewUser(user) {
  const inserting = extractValidFields(user, UserSchema);
  inserting.password = await bcrypt.hash(inserting.password, 8);
  const db = getDbInstance();
  const collection = db.collection("users");
  console.log("== Attempting to insert 'user':\n", user);
  const result = await collection.insertOne(inserting);
  return result.insertedId;
}

exports.insertNewUser = insertNewUser;

async function getUserByEmail(email) {
  const db = getDbInstance();
  const collection = db.collection("users");
  console.log("== Attempting to lookup 'user' with email: ", email);
  const results = await collection.find({ email: email }).toArray();
  if (results.length == 0) {
    return false;
  }
  return results[0];
}
exports.getUserByEmail = getUserByEmail;

/*
Returns information about the specified User. If the User has the 'instructor' role, the response should include a list of the IDs of the Courses the User teaches (i.e. Courses whose instructorId field matches the ID of this User). If the User has the 'student' role, the response should include a list of the IDs of the Courses the User is enrolled in.
*/
async function getUserById(id) {
  console.log(id)
  const db = getDbInstance();
  const collection = db.collection("users");
  console.log("== Attempting to lookup 'user' by id: ", id);
  const user = await collection
    .aggregate([
      {
        $match: {
          _id: new ObjectId(id),
        },
      },
    ])
    .toArray();
  if (user.length == 0) {
    return false;
  }
  if (user[0].role === "student") {
    const results = await collection
      .aggregate([
        {
          $match: {
            _id: new ObjectId(id),
          },
        },
        {
          $lookup: {
            from: "courses",
            localField: "_id",
            foreignField: "students._id",
            as: "coursesEnrolled",
          },
        },
      ])
      .toArray();
    let stuEnrolled = [];
    for (let i = 0; i < results[0].coursesEnrolled.length; i++) {
      stuEnrolled.push(results[0].coursesEnrolled[i]._id);
    }
    results[0].coursesEnrolled = stuEnrolled;
    return results[0];
  } else if (user[0].role === "instructor") {
    const results = await collection
      .aggregate([
        {
          $match: {
            _id: new ObjectId(id),
          },
        },
        { $addFields: { id: { $toString: "$_id" } } },
        {
          $lookup: {
            from: "courses",
            localField: "id",
            foreignField: "instructorId",
            as: "coursesInstructing",
          },
        },
      ])
      .toArray();
    let insInstructing = [];
    for (let i = 0; i < results[0].coursesInstructing.length; i++) {
      insInstructing.push(results[0].coursesInstructing[i]._id);
    }
    results[0].coursesInstructing = insInstructing;
    return results[0];
  } else {
    // Admins view both
    const results = await collection.aggregate([
      {
        $match: {
          _id: new ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "students._id",
          as: "coursesEnrolled",
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "instructorId",
          as: "coursesInstructing",
        },
      },
    ]);
    return results[0];
  }
}
exports.getUserById = getUserById;

async function bulkInsertNewUsers(users) {
  for (let user of users) {
    await insertNewUser(user)
  }
}
exports.bulkInsertNewUsers = bulkInsertNewUsers
