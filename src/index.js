import express from "express";
import {
  query,
  body,
  matchedData,
  validationResult,
  checkSchema,
} from "express-validator";
import { createUserVaidationSchema } from "./utils/validationSchema.js";
const PORT = process.env.PORT || 4000;
const app = express();
app.use(express.json());

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
//middleware function
const resolveIdUsers = (req, res, next) => {
  const {
    params: { id },
  } = req;
  const parseId = parseInt(id);
  if (isNaN(parseId)) return res.sendStatus(400);
  const findUserIndex = mockUsers.findIndex((user) => user.id === parseId);
  if (findUserIndex === -1) return res.sendStatus(404);
  req.findUserIndex = findUserIndex;
  next();
};
//Using Query user get
//http://localhost:4000/api/users?filter=username&value=ma
app.get(
  "/api/users",
  query("filter")
    .isString()
    .notEmpty()
    .withMessage("Must not be empty!")
    .isLength({ min: 5, max: 10 })
    .withMessage("Must be at lest 3-10 characters."),
  (req, res) => {
    const result = validationResult(req);
    const {
      query: { filter, value },
    } = req;
    console.log(result);
    if (!filter && !value) return res.send(mockUsers);
    if (filter && value)
      return res.send(mockUsers.filter((user) => user[filter].includes(value)));
    return res.status(201).send(mockUsers);
  }
);

// All users get

app.get("/api/users", (req, res) => {
  res.status(201).send(mockUsers);
});

// One user get
//use middleware resolveIdUsers function
app.get("/api/users/:id", resolveIdUsers, (req, res) => {
  const { findUserIndex } = req;
  const findUser = mockUsers[findUserIndex];
  if (!findUser) return res.sendStatus(404);
  return res.send(findUser);
});

//Create user post

app.post(
  "/api/users",
  //validation username body function use in express-validation
  checkSchema(createUserVaidationSchema),
  (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty())
      return res.status(400).send({ error: result.array() });
    const data = matchedData(req);
    const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data };
    mockUsers.push(newUser);
    return res.status(201).send(newUser);
  }
);

app.put("/api/users/:id", resolveIdUsers, (req, res) => {
  const { body, findUserIndex } = req;
  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
  return res.sendStatus(200);
});

app.patch("/api/users/:id", resolveIdUsers, (req, res) => {
  const { body, findUserIndex } = req;
  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  return res.sendStatus(200);
});

app.delete("/api/users/:id", resolveIdUsers, (req, res) => {
  const { findUserIndex } = req;
  mockUsers.splice(findUserIndex, 1);
  return res.sendStatus(200);
});
