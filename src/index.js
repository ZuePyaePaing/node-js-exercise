import express, { json } from "express";

const PORT = process.env.PORT || 4000;
const app = express();
app.use(json());

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

const mockUsers = [
  { id: 1, username: "maung zaw", displayname: "zaw gyi" },
  { id: 2, username: "aung zaw", displayname: "aung gyi" },
  { id: 3, username: "kyaw zaw", displayname: "kyaw gyi" },
  { id: 4, username: "maw zaw", displayname: "maw gyi" },
  { id: 5, username: "kaung zaw", displayname: "kaw gyi" },
];
//Using Query user get
//http://localhost:4000/api/users?filter=username&value=ma
app.get("/api/users", (req, res) => {
  const {
    query: { filter, value },
  } = req;
  if (!filter && !value) return res.send(mockUsers);
  if (filter && value)
    return res.send(mockUsers.filter((user) => user[filter].includes(value)));
  return res.status(201).send(mockUsers);
});

// All users get

app.get("/api/users", (req, res) => {
  res.status(201).send(mockUsers);
});

// One user get

app.get("/api/users/:id", (req, res) => {
  const parseId = parseInt(req.params.id);
  if (isNaN(parseId))
    return res.status(400).send({ msg: "Bad Request. Invalid ID." });
  const findUser = mockUsers.find((user) => user.id === parseId);
  if (!findUser) return res.sendStatus(404);
  return res.send(findUser);
});

//Create user post

app.post("/api/users", (req, res) => {
  const { body } = req;
  const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...body };
  mockUsers.push(newUser);
  return res.status(201).send(newUser);
});

app.put("/api/users/:id", (req, res) => {
  const {
    body,
    params: { id },
  } = req;
  const parseId = parseInt(id);
  if (isNaN(parseId)) return res.sendStatus(400);
  const findUserIndex = mockUsers.findIndex((user) => user.id === parseId);
  if (findUserIndex === -1) return res.sendStatus(404);
  mockUsers[findUserIndex] = { id: parseId, ...body };
  return res.sendStatus(200);
});

app.patch("/api/users/:id", (req, res) => {
  const {
    body,
    params: { id },
  } = req;
  const parseId = parseInt(id);
  if (isNaN(parseId)) return res.sendStatus(400);
  const findUserIndex = mockUsers.findIndex((user) => user.id === parseId);
  if (findUserIndex === -1) return res.sendStatus(404);
  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  return res.sendStatus(200);
});

app.delete("/api/users/:id", (req, res) => {
  const { params: {id} } = req;
  const parseId = parseInt(id);
  if (isNaN(parseId)) return res.sendStatus(400);
  const findUserIndex = mockUsers.findIndex((user) => user.id === parseId);
  if (findUserIndex === -1) return res.sendStatus(404);
  mockUsers.splice(findUserIndex,1);
  return res.sendStatus(200);
});
