const { verifyAdmin, requireAuth } = require("../lib/auth");
const { ObjectId } = require("mongodb");
const { getDbInstance } = require("../lib/mongo");
const { validateAgainstSchema, extractValidFields } = require("../lib/valid");
const CourseSchema = {
  subject: { required: true },
  number: { required: true },
  title: { required: true },
  term: { required: true },
  instructorId: { required: true },
};
const {
  getUserById
} = require("./user");
exports.CourseSchema = CourseSchema;

async function getCourseById(id) {
  const db = getDbInstance();
  const collection = db.collection("courses");
  console.log("== Attempting to lookup 'course' by id: ", id);
  if (!ObjectId.isValid(id)) {
    return null;
  } else {
    const results = await collection.find({ _id: new ObjectId(id) }).toArray();
    if (results.length == 0) {
      return false;
    }
    return results[0];
  }
}
exports.getCourseById = getCourseById;

async function insertNewCourse(course) {
  const inserting = extractValidFields(course, CourseSchema);
  const db = getDbInstance();
  const collection = db.collection("courses");
  console.log("== Attempting to insert 'course':\n", course);
  const result = await collection.insertOne(inserting);
  return result.insertedId;
}
exports.insertNewCourse = insertNewCourse;

async function patchCourseById(id, originalCourse, request) {
  const db = getDbInstance();
  const collection = db.collection("courses");
  console.log("== Attempting to patch 'course' by id: ", id);

  let courseValues = {
    subject: request.subject,
    number: request.number,
    title: request.title,
    term: request.term,
    instructorId: request.instructorId,
  };

  // keep the students
  if (originalCourse.students !== undefined) {
      courseValues.students = originalCourse.students
  }

  const result = await collection.replaceOne(
    { _id: new ObjectId(id) },
    courseValues
  );
  return result.matchedCount > 0;
}
exports.patchCourseById = patchCourseById;

async function getAllCourses(subject, number, term) {
  const db = getDbInstance();
  const collection = db.collection("courses");
  let findSearchFilter = {};
  for (let [arg, label] of [
    [subject, "subject"],
    [number, "number"],
    [term, "term"],
  ]) {
    if (arg !== undefined) {
      findSearchFilter[label] = arg;
    }
  }
  return await collection.find(findSearchFilter).toArray();
}
exports.getAllCourses = getAllCourses;

async function deleteCourseById(id) {
  const db = getDbInstance();
  const collection = db.collection("courses");
  console.log("== Attempting to delete 'course' by id: ", id);
  const result = await collection.deleteOne({
    _id: new ObjectId(id),
  });
  return result.deletedCount > 0;
}
exports.deleteCourseById = deleteCourseById;

async function getUserByIdForRoster(id) {
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
  return user;
}
exports.getUserByIdForRoster = getUserByIdForRoster;

async function updateCourseRoster(id, course, request) {
  // TODO review more
  const db = getDbInstance();
  const collection = db.collection("courses");
  console.log("== Attempting to update 'course' student roster");
  var newRoster = course.students || [];

  // Add Students
  for (let a = 0; a < request.add.length; a++) {
    // const response = await getUserByIdForRoster(request.add[a]);
    const student = await getUserById(request.add[a])

    if (student) {
      console.log("== Adding student:", student);
      newRoster.push(student);
    }
    else{
      console.log(`== Student ${request.add[a]} does not exist. Skipping.`)
    }
  }
  // Remove Students
  for (let r = 0; r < request.remove.length; r++) {
    const response = await getUserByIdForRoster(request.remove[r]);
    if (response) {
      console.log("== Removing student:", response[0]);
      for (let i = 0; i < newRoster.length; i++) {
        if (newRoster[i].name === response[0].name) {
          newRoster.splice(i, 1);
        }
      }
    }
  }

  const courseValues = {
    subject: course.subject,
    number: course.number,
    title: course.title,
    term: course.term,
    instructorId: course.instructorId,
    students: newRoster,
  };

  const result = await collection.replaceOne(
    { _id: new ObjectId(id) },
    courseValues
  );
  return result.matchedCount > 0;
}
exports.updateCourseRoster = updateCourseRoster;


async function getCourseAssignments(id) {
    const db = getDbInstance()
    const collection = db.collection('assignments')
    console.log("== Attempting to find course 'assignment's by id: ", id)
    const results = await collection.find({
        courseId: id
    }).toArray()
    return results
  }
exports.getCourseAssignments = getCourseAssignments

async function bulkInsertNewCourses(courses) {
  const coursesToInsert = courses.map(function (course) {
      return extractValidFields(course, CourseSchema)
  })
  const db = getDbInstance()
  const collection = db.collection('courses')
  const result = await collection.insertMany(coursesToInsert)
  return result.insertedIds
}
exports.bulkInsertNewCourses = bulkInsertNewCourses