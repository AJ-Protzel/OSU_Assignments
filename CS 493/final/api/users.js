const router = require("express").Router();
exports.router = router;

const bcrypt = require("bcryptjs");

const { verifyAdmin, generateAuthToken, requireAuth } = require("../lib/auth");
const { ObjectId } = require("mongodb");
const { getDbInstance } = require("../lib/mongo");
const { validateAgainstSchema, extractValidFields } = require("../lib/valid");
const {
  UserSchema,
  LoginSchema,
  insertNewUser,
  getUserByEmail,
  getUserById,
} = require("../models/user");

// const { rateLimit } = require("../server.js");
// router.use(rateLimit)

router.post("/", requireAuth, async function (req, res) {
  if (!validateAgainstSchema(req.body, UserSchema)) {
    return res.status(400).send({
      error: "Request body does not contain a valid User body",
    });
  }

  if (req.body.role === "admin" || req.body.role === "instructor") {
    if ((await verifyAdmin(req.user)) == true) {
      const id = await insertNewUser(req.body);
      return res.status(201).send({
        _id: id,
      });
    }
    else{
      return res.status(403).send({
        error:
          "User is unable to create a User with the 'admin' or 'instructor' role",
      });
    }
  }
  else{
    const id = await insertNewUser(req.body);
    return res.status(201).send({
      _id: id,
    });
  }
});

router.post("/login", async function (req, res) {
  if (!validateAgainstSchema(req.body, LoginSchema)) {
    return res.status(400).send({
      error: "Request body does not contain a valid Login body",
    });
  }
  const user = await getUserByEmail(req.body.email);
  console.log("== Attempting to login 'user':\n", user);
  const authentication =
    user && (await bcrypt.compare(req.body.password, user.password));
  if (authentication) {
    const token = generateAuthToken(ObjectId(user._id));
    return res.status(200).send({
      token: token,
    });
  }
  return res.status(401).send({
    error: "Invalid Authentication for Login",
  });
});

// user created with "admin canot be found" // "instructor" works
router.get("/:id", requireAuth, async function (req, res) {
  if ((await verifyAdmin(req.user)) == true || req.user === req.params.id) {
    const user = await getUserById(req.params.id);
    if (user) {
      return res.status(200).send(user);
    }
    return res.status(404).send({
      error: "The User of specified 'id' was not found",
    });
  }
  return res.status(403).send({
    error: "Failed authentication for get of this 'user'",
  });
});

// Only made for ease of creation and checking users
// NOT PART OF PROJECT
router.options("/", async function (req, res) {
  const db = getDbInstance();
  const collection = db.collection("users");
  const users = await collection.find({}).toArray();
  res.status(202).send(users);
});

// module.exports = router