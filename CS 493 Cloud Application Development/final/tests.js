const axios = require('axios');
const res = require('express/lib/response');

const BASE_URL = "http://localhost:8000"

const PASSWORD = "hunter2"

function get(url, config){
  return axios
  .get(url,config)
  .then(async res => {
    console.log(`== GET ${url} STATUS: ${res.status}`);
    currRes = res.data
  })
  .catch(error => {
    console.log(`== GET ${url} STATUS: ${error.response.status}`)
    console.error(error.response.data);
  });
}

function del(url, config){
  return axios
  .delete(url,config)
  .then(async res => {
    console.log(`== GET ${url} STATUS: ${res.status}`);
    currRes = res.data
  })
  .catch(error => {
    console.log(`== GET ${url} STATUS: ${error.response.status}`)
    console.error(error.response.data);
  });
}

var currRes = ""

async function post(url, body, config){
  return axios
  .post(url, body, config)
  .then(async res => {
    console.log(`== POST ${url} STATUS: ${res.status}`);
    currRes = res.data
  })
  .catch(error => {
    console.log(`== POST ${url} STATUS: ${error.response.status}`)
    console.error(error.response.data);
  });
}

async function patch(url, body, config){
  return axios
  .patch(url, body, config)
  .then(async res => {
    console.log(`== PATCH ${url} STATUS: ${res.status}`);
    currRes = res.data
  })
  .catch(error => {
    console.log(`== PATCH ${url} STATUS: ${error.response.status}`)
    console.error(error.response.data);
  });
}

async function opt(url){
  return axios
  .options(url)
  .then(async res => {
    console.log(`== OPT ${url} STATUS: ${res.status}`);
    currRes = res.data
  })
  .catch(error => {
  });
}



/* */
async function main(){
  await post(`${BASE_URL}/users/login`, {email: "admin@admin.com", password: PASSWORD})
  var adminTok = currRes.token
  
  await post(`${BASE_URL}/users/login`, {email: "wash@gmail.com", password: PASSWORD})
  var teacherTok = currRes.token
  
  await post(`${BASE_URL}/users/login`, {email: "aston@gmail.com", password: PASSWORD})
  var studentTok = currRes.token

    
  await post(`${BASE_URL}/users/login`, {email: "ryuu@gmail.com", password: PASSWORD})
  var otherTeacherTok = currRes.token

  await post(`${BASE_URL}/users/login`, {email: "pierce@gmail.com", password: PASSWORD})
  var otherStudentTok = currRes.token

  console.log(`ADMIN TOKEN: ${adminTok}\n`)
  console.log(`TEACHER (wash) TOKEN: ${teacherTok}\n`)
  console.log(`OTHER TEACHER (ryuu) TOKEN: ${otherTeacherTok}\n`)
  console.log(`STUDENT (aston) TOKEN: ${studentTok}\n`)
  console.log(`OTHER STUDENT (jessica) TOKEN: ${otherStudentTok}\n`)

  await opt(`${BASE_URL}/users/`)
  var studentId= currRes[0]._id
  var teacherId = currRes[1]._id
  var otherStudentId = currRes[5]._id


  /* tests */
  console.log("\n")
  console.log("Create a course as teacher?")
  var token = teacherTok
  await post(`${BASE_URL}/courses`, {
    "subject": "MUS",
    "number": "151",
    "title": "Campus Band",
    "term": "fl22",
    "instructorId": teacherId
  }, { headers: { Authorization: `Bearer ${token}` } }
)
console.log("\n")
  
  console.log("Create a course as student?")
  token = studentTok
  await post(`${BASE_URL}/courses`, {
    "subject": "MUS",
    "number": "151",
    "title": "Campus Band",
    "term": "fl22",
    "instructorId": teacherId
  }, { headers: { Authorization: `Bearer ${token}` } }
)
console.log("\n")

  console.log("create course as admin")
  token = adminTok
  await post(`${BASE_URL}/courses`, {
    "subject": "MUS",
    "number": "151",
    "title": "Campus Band",
    "term": "fl22",
    "instructorId": teacherId
  }, { headers: { Authorization: `Bearer ${token}` } }
  )
  var courseId = currRes._id
  console.log(studentId)
  /* Create assignment */
  console.log("\n")
  
  console.log("add a student to a class when not instructor of that class")
  token = otherTeacherTok
  var addArr = []
  addArr[0] = studentId
  await post(`${BASE_URL}/courses/${courseId}/students`, 
            {"add": addArr, "remove": []},
            { headers: { Authorization: `Bearer ${token}` } }
 )
 console.log("\n")

  console.log("add a student to a class as the owner of the class")
  token = teacherTok
  var addArr = []
  addArr[0] = studentId
  await post(`${BASE_URL}/courses/${courseId}/students`, 
            {"add": addArr, "remove": []},
            { headers: { Authorization: `Bearer ${token}` } }
 )
 token = teacherTok
 console.log(`GET course students from course ${courseId}`)
 await get(`${BASE_URL}/courses/${courseId}/students`,
                  {headers: { Authorization: `Bearer ${token}` }}
 )
 console.log(currRes)

 token = teacherTok
 await get(`${BASE_URL}/courses/${courseId}/roster`,
            {headers: { Authorization: `Bearer ${token}` }}
            )
  console.log(currRes)
  console.log("\n")
  
  console.log("create an assignment as non-owner of a course")
  token = otherTeacherTok
  await post(`${BASE_URL}/assignments`, {
    "courseId": courseId,
    "title": "Graduate",
    "points": "100",
    "due": "2022-06-14T17:00:00-07:00"
  }, { headers: { Authorization: `Bearer ${token}` } }
  )

  console.log("\n")
  
  console.log("create an assignment as owner of a course")
  token = teacherTok
  await post(`${BASE_URL}/assignments`, {
    "courseId": courseId,
    "title": "Graduate",
    "points": "100",
    "due": "2022-06-14T17:00:00-07:00"
  }, { headers: { Authorization: `Bearer ${token}` } }
  )
  
  var assignmentId = currRes._id
  token = teacherTok
  console.log(`GET course ${courseId} assignments`)
  await get(`${BASE_URL}/courses/${courseId}/assignments`, {headers: {Authorization: `Bearer ${token}`}})
  console.log(currRes)

  token = teacherTok
  console.log("update an assignment as owner of a course")
  token = teacherTok
  await patch(`${BASE_URL}/assignments/${assignmentId}`, {
    "courseId": courseId,
    "title": "Midterm",
    "points": "500",
    "due": "2022-06-14T17:00:00-07:00"
  }, { headers: { Authorization: `Bearer ${token}` } }
  )

  token = teacherTok
  console.log(`GET course ${courseId} assignments`)
  await get(`${BASE_URL}/courses/${courseId}/assignments`, {headers: {Authorization: `Bearer ${token}`}})
  console.log(currRes)

  console.log(`delete this assignment`)
  await del(`${BASE_URL}/assignments/${assignmentId}`, 
            { headers: { Authorization: `Bearer ${token}` } })

  console.log("make the assignment again")
  await post(`${BASE_URL}/assignments`, {
    "courseId": courseId,
    "title": "Graduate",
    "points": "100",
    "due": "2022-06-14T17:00:00-07:00"
  }, { headers: { Authorization: `Bearer ${token}` } }
  )
  assignmentId = currRes._id

  token = teacherTok
  console.log(`GET course ${courseId} assignments`)
  await get(`${BASE_URL}/courses/${courseId}/assignments`, {headers: {Authorization: `Bearer ${token}`}})
  console.log(currRes)

  console.log("USERS")
  
  console.log("\nCOURSES")
  token = adminTok
  console.log("GET all the courses ")
  await get(`${BASE_URL}/courses`, {headers: {Authorization: `Bearer ${token}`}})
  console.log(currRes)


  var getThisCourse = currRes.courses[0]._id

  console.log(`GET course ${getThisCourse}`)
  await get(`${BASE_URL}/courses/${getThisCourse}`, {headers: {Authorization: `Bearer ${token}`}})
  console.log(currRes)

  console.log(`PATCH modify course ${getThisCourse}`)
  await patch(`${BASE_URL}/courses/${getThisCourse}`, {
    "subject": "CS",
    "number": "450",
    "title": "Intro to Computer Graphics",
    "term": "fl22",
    "instructorId": "1337"
  }, {headers: {Authorization: `Bearer ${token}`}})

  console.log(`DELETE course ${getThisCourse}`)
  await del(`${BASE_URL}/courses/${getThisCourse}`, {headers: {Authorization: `Bearer ${token}`}})
  


  console.log(`\nSTUDENT TOKEN: ${studentTok}`)
  console.log(`STUDENT ID: ${studentId}`)

  console.log(`\nOTHER STUDENT TOKEN: ${otherStudentTok}`)
  console.log(`OTHER STUDENT ID: ${otherStudentId}`)
  console.log(`\nASSIGNMENT ID: ${assignmentId}`)
  console.log(`COURSE ID: ${courseId}`)



}
main()
