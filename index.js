const firebase = require("firebase");
const _ = require("underscore");
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const app = express();
const port = 5502;
const origin = "/index.html";
const thanksPage = "/thanks.html";
const upload = multer();
app.use(express.static("./public"));
app.use(bodyParser.urlencoded());
app.use(upload.array());

// firebase.initializeApp({
//   apiKey: "AIzaSyDJMt1tB21TIo6Y2p6bfUCSbLzDZVyaK74",
//   authDomain: "blooddonations-5673c.firebaseapp.com",
//   projectId: "blooddonations-5673c",
//   storageBucket: "blooddonations-5673c.appspot.com",
//   messagingSenderId: "72738388190",
//   appId: "1:72738388190:web:00028344298a839c40aa4f",
//   measurementId: "G-2X8KSL0N1E",
// });
const db = firebase.firestore();

async function addUser(user) {
  await db.collection("users").add(user);
}

async function getUser(userid) {
  let users = await getUsers();
  console.log(users);
  return _.filter(users, (user) => user.id == userid);
}
async function getUsers() {
  return (await db.collection("users").get()).docs.map((doc) => doc.data());
}

app.get("/api/users", async (req, res) => {
  res.send(await getUsers());
  res.redirect(origin);
});

app.get("/api/users/:userid", async (req, res) => {
  res.send(await getUser(req.params.userid));
  // res.redirect(origin);
});

app.post("/api/users", async (req, res) => {
  console.log("body: ", req.body);
  await addUser(req.body);
  // res.redirect(thanksPage);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
