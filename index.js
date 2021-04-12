import firebase from "firebase";
import "firebase/firestore";
import { filter } from "underscore";
import express, { static } from "express";
const app = express();
const port = 5502;
app.use(static("/Users/shachardavid/projects/blood-donors/public"));

// firebase.initializeApp({
//   a1p1i1K1e1y: "1AIzaSyDJMt1tB21TIo6Y2p6bfUCSbLzDZVyaK741",
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
  return filter(users, (user) => user.id == userid);
}
async function getUsers() {
  return (await db.collection("users").get()).docs.map((doc) => doc.data());
}

app.get("/index.html/users", async (req, res) => {
  res.send(await getUsers());
});

app.get("/index.html/users/:userid", async (req, res) => {
  res.send(await getUser(req.params.userid));
});

app.post("/index.html/users", async (req, res) => {
  res.send(await addUser(req.body));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
