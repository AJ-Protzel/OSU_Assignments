const router = require("express").Router();
exports.router = router;

const { verifyAdmin, requireAuth } = require("../lib/auth");
const { ObjectId } = require("mongodb");
const { getDbInstance } = require("../lib/mongo");
const { validateAgainstSchema, extractValidFields } = require("../lib/valid");
const {
  CourseSchema,
  getCourseById,
  insertNewCourse,
  patchCourseById,
  getAllCourses,
  updateCourseRoster,
  deleteCourseById,
  getCourseAssignments,
  getUserByIdForRoster,
} = require("../models/course");
const {
  getUserById
} = require("../models/user");

const ModifyStudentsInCourseSchema = {
  add: { required: true },
  remove: { required: true },
};

// create a course (instructor users only)
router.post("/", requireAuth, async function (req, res) {
  if (!validateAgainstSchema(req.body, CourseSchema)) {
    return res.status(400).send({
      error: "Request body does not contain a valid Course body",
    });
  }

  if ((await verifyAdmin(req.user)) == true) {
    // If Admin is found then course may be created
    const id = await insertNewCourse(req.body);
    return res.status(201).send({
      _id: id,
    });
  }

  return res.status(403).send({
    error: "User is unable to create a Course",
  });
});

// list all courses (all users)
router.get("/", async function (req, res) {
  var courses = await getAllCourses(
    req.query.subject,
    req.query.number,
    req.query.term
  );

  var page = parseInt(req.query.page) || 1;
  var numPerPage = 3;
  var lastPage = Math.ceil(courses.length / numPerPage);
  page = page < 1 ? 1 : page;
  page = page > lastPage ? lastPage : page;

  var start = (page - 1) * numPerPage;
  var end = start + numPerPage;
  var pageCourses = courses.slice(start, end);

  var links = {};
  if (page < lastPage) {
    links.nextPage = "/courses?page=" + (page + 1);
    links.lastPage = "/courses?page=" + lastPage;
  }
  if (page > 1) {
    links.prevPage = "/courses?page=" + (page - 1);
    links.firstPage = "/courses?page=1";
  }

  res.status(200).json({
    pageNumber: page,
    totalPages: lastPage,
    pageSize: numPerPage,
    totalCount: courses.length,
    courses: pageCourses,
    links: links,
  });
});

// get course by id (all users)
router.get("/:id", async function (req, res) {
  const course = await getCourseById(req.params.id);
  if (course) {
    res.status(200).send(course);
  } else {
    // User found Else
    res.status(404).send({
      error: "The Course of specified 'id' was not found",
    });
  }
});

// modify course by id (instructor users only)
router.patch("/:id", requireAuth, async function (req, res) {
  if (validateAgainstSchema(req.body, CourseSchema)) {
    const course = await getCourseById(req.params.id);
    if (course) {
      if (
        (await verifyAdmin(req.user)) == true ||
        req.user === course.instructorId
      ) {
        const updated = await patchCourseById(req.params.id, course, req.body);
        res.status(200).send(course);
      } else {
        res.status(403).send({
          error: "Failed authentication for modification of this 'course'",
        });
      }
    } else {
      res.status(404).send({
        error: "The Course of specified 'id' was not found",
      });
    }
  } else {
    res.status(400).send({
      error: "Request body is not a valid Course object",
    });
  }
});

// delete course by id (instructor users only)
router.delete("/:id", requireAuth, async function (req, res) {
  const course = await getCourseById(req.params.id);
  if (course) {
    if ((await verifyAdmin(req.user)) == true) {
      const response = await deleteCourseById(req.params.id);
      res.status(204).send(response);
    } else {
      res.status(403).send({
        error: "Failed authentication for deletion of this 'course'",
      });
    }
  } else {
    res.status(404).send({
      error: "The Course of specified 'id' was not found",
    });
  }
});

// get all students from course by id (instructor users only)
router.get("/:id/students", requireAuth, async function (req, res) {
  const course = await getCourseById(req.params.id);
  if (course) {
    if (
      (await verifyAdmin(req.user)) == true ||
      req.user === course.instructorId
    ) {
      res.status(200).send(course.students);
    } else {
      res.status(403).send({
        error: "Failed authentication for modification of this 'course'",
      });
    }
  } else {
    res.status(404).send({
      error: "The Course of specified 'id' was not found",
    });
  }
});

// idk
router.post("/:id/students", requireAuth, async function (req, res) {
  const course = await getCourseById(req.params.id);
  if (validateAgainstSchema(req.body, ModifyStudentsInCourseSchema)) {
    if (course) {
      if (
        (await verifyAdmin(req.user)) == true ||
        req.user === course.instructorId
      ) {
        const updated = await updateCourseRoster(
          req.params.id,
          course,
          req.body
        );
        res.status(200).send();
      } else {
        res.status(403).send({
          error: "Failed authentication for modification of this 'course'",
        });
      }
    } else {
      res.status(404).send({
        error: "The Course of specified 'id' was not found",
      }); 
    }
  } else {
    res.status(400).send({
      error: "Request body is not a valid Course object",
    });
  }
});

// idk
router.get("/:id/roster", requireAuth, async function (req, res) {
  const course = await getCourseById(req.params.id);
  if (course) {
    if (
      (await verifyAdmin(req.user)) == true ||
      req.user === course.instructorId
    ) {
      var csvString = "";
      if(typeof(course.students) !== "undefined"){
        for (let i = 0; i < course.students.length; i++) {
          csvString += course.students[i]._id + ",";
          csvString += course.students[i].name + ",";
          csvString += course.students[i].email;
          csvString += "\n"
        }
      }
      csvString = csvString.slice(0, -1);
      res.status(200).send(csvString);
    } else {
      res.status(403).send({
        error: "Failed authentication for receiving roster of this 'course'",
      });
    }
  } else {
    res.status(404).send({
      error: "The Course of specified 'id' was not found",
    });
  }
});

// idk
router.get("/:id/assignments", async function (req, res) {
  const course = await getCourseById(req.params.id);
  if (course) {
    res.status(200).send(await getCourseAssignments(req.params.id));
  } else {
    res.status(404).send({
      error: "The Course of specified 'id' was not found",
    });
  }
});

// Only made for ease of creation and checking courses
// NOT PART OF PROJECT
router.options("/ac", async function (req, res) {
  const db = getDbInstance();
  const collection = db.collection("courses");
  const courses = await collection.find({}).toArray();
  res.status(202).send(courses);
});
