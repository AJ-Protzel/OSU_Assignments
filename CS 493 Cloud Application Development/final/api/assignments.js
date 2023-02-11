const router = require("express").Router();
exports.router = router;

const { verifyAdmin, requireAuth } = require("../lib/auth");
const { ObjectId } = require("mongodb");
const { getDbInstance } = require("../lib/mongo");
const { validateAgainstSchema, extractValidFields } = require("../lib/valid");
const {
  SubmissionSchema,
  insertNewSubmission,
  getAllAssignmentSubmissions,
  updateSubmissionFileLinkById,
} = require("../models/submission");
const {
  AssignmentSchema,
  insertNewAssignment,
  getAssignmentById,
  patchAssignmentById,
  deleteAssignmentById
} = require("../models/assignment");
const { getCourseById } = require("../models/course");

const multer = require('multer')
const crypto = require('crypto')

const upload = multer({
  storage: multer.diskStorage({
    destination: `${__dirname}/uploads`,
    filename: function (req, file, callback) {
      const ext = "something"
      const filename = crypto.pseudoRandomBytes(16).toString('hex')
      callback(null, `${filename}.${ext}`)
    }
  })
})


router.post("/", requireAuth, async function (req, res) {
  if (!validateAgainstSchema(req.body, AssignmentSchema)) {
    return res.status(400).send({
      error: "Request body does not contain a valid Assignment body",
    });
  }
  const course = await getCourseById(req.body.courseId);
  if (
    (await verifyAdmin(req.user)) == true ||
    req.user === course.instructorId
  ) {
    const id = await insertNewAssignment(req.body);
    return res.status(201).send({
      _id: id,
    });
  }
  return res.status(403).send({
    error: "User is unable to create an Assignment",
  });
});

router.get("/:id", async function (req, res) {
  const assignment = await getAssignmentById(req.params.id);
  if (assignment) {
    res.status(200).send(assignment);
  } else {
    res.status(404).send({
      error: "The Assignment of specified 'id' was not found",
    });
  }
});

router.patch("/:id", requireAuth, async function (req, res) {
  if (validateAgainstSchema(req.body, AssignmentSchema)) {
    const course = await getCourseById(req.body.courseId);
    const assignment = await getAssignmentById(req.params.id);
    if (assignment) {
      if (
        (await verifyAdmin(req.user)) == true ||
        req.user === course.instructorId
      ) {
        const results = await patchAssignmentById(req.params.id, req.body);
        res.status(200).send();
      } else {
        res.status(403).send({
          error: "Failed authentication for modification of this 'assignment'",
        });
      }
    } else {
      res.status(404).send({
        error: "The Assignment of specified 'id' was not found",
      });
    }
  } else {
    res.status(400).send({
      error: "Request body is not a valid Assignment object",
    });
  }
});

router.delete("/:id", requireAuth, async function (req, res) {
  const assignment = await getAssignmentById(req.params.id);
  const course = await getCourseById(assignment.courseId);
  if (assignment) {
    if ((await verifyAdmin(req.user)) == true ||
        req.user === course.instructorId
        ) {
      const response = await deleteAssignmentById(req.params.id);
      res.status(204).send();
    } else {
      res.status(403).send({
        error: "Failed authentication for deletion of this 'assignment'",
      });
    }
  } else {
    res.status(404).send({
      error: "The Assignment of specified 'id' was not found",
    });
  }
});

// get asn subs
router.get("/:id/submissions", requireAuth, async function (req, res) {
  // TODO validation
  let submissions = await getAllAssignmentSubmissions(req.params.id,req.query.studentId)
  console.log(`subs: ${submissions}`)
  let page = parseInt(req.query.page) || 1;
  let numPerPage = 3;
  let lastPage = Math.ceil(submissions.length / numPerPage);
  page = page < 1 ? 1 : page;
  page = page > lastPage ? lastPage : page;

  let start = (page - 1) * numPerPage;
  let end = start + numPerPage;
  let pageSubmissions = submissions.slice(start, end);

  let links = {};
  if (page < lastPage) {
    links.nextPage = "/submissions?page=" + (page + 1);
    links.lastPage = "/submissions?page=" + lastPage;
  }
  if (page > 1) {
    links.prevPage = "/submissions?page=" + (page - 1);
    links.firstPage = "/submissions?page=1";
  }

  return res.status(200).json({
    pageNumber: page,
    totalPages: lastPage,
    pageSize: numPerPage,
    totalCount: submissions.length,
    submissions: pageSubmissions,
    links: links,
  });
});

// make a new sub for a given asn
router.post("/:id/submissions", [requireAuth, upload.single('file')], async function (req, res) {
  // TODO more validation here
  if (!validateAgainstSchema(req.body, SubmissionSchema)) {
    return res.status(400);
  }

  const file = {
    path: req.file.path,
    filename: req.file.filename,
    mimetype: req.file.mimetype,
   ...req.body
  }
  const course = await getCourseById(req.params.id);
  if(!course || typeof(course) === 'undefined') return res.status(400).send()
  if(!(Array.isArray(course.students))) return res.status(400).send()

  var isInClass = false
  for(let student of course.students){
    if(student._id == req.body.studentId){
      isInClass = true
      break
    }
  }

  if(!isInClass) return res.status(400).send()
  const id = await insertNewSubmission(file);
  await updateSubmissionFileLinkById(id,`/media/files/${id}`)
  res.status(200).send(id)
});

// Only made for ease of creation and checking users
// NOT PART OF PROJECT
router.options("/", async function (req, res) {
  const db = getDbInstance();
  const collection = db.collection("assignments");
  const assignments = await collection.find({}).toArray();
  const submissions = await db.collection("submissions.files").find({}).toArray();
  res.status(202).send({
    assignments: assignments,
    submissions: submissions
  });
});
