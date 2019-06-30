const express = require("express");

const server = express();

server.use(express.json());
// Query params = ?users=1
// Route params = /users/1
// Request boby = {"name": "Carlos", "email": "casdorio@gmail.com" }

// GRUD - Create, Read, Update, Delete

const users = ["carlos", "Diegoss", "Victor"];

server.use((req, res, next) => {
  console.time("Request");
  console.log(`Método: ${req.method}; URL: ${req.url}`);
  next();
  console.timeEnd("Request");
});

function CheckUserExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: "User name is required" });
  }
  return next();
}

function CheckUserInArray(req, res, next) {
    const user = users[req.params.index];
    if (!user) {
      return res.status(400).json({ error: "User does not exists" });
    }
    req.user = user;
    return next();
  }
//localhost:3000/users
server.get("/users", CheckUserInArray, (req, res) => {
  return res.json(users);
});

//localhost:3000/users/1
server.get("/users/:index", CheckUserInArray, (req, res) => {
  const { index } = req.params;
  return res.json(req.user);
});

server.post("/users", CheckUserExists, (req, res) => {
  const { name } = req.body;
  users.push(name);
  
  return res.json(users);
});

server.put("/users/:index", CheckUserExists, CheckUserInArray, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;
  users[index] = name;

  return res.json(users);
});

server.delete("/users/:index", CheckUserInArray, (req, res) => {
  const { index } = req.params;
  users.splice(index, 1);
  return res.send();
});

server.listen(3000);
