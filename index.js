const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const port = 3000;

let tasks = [
  {
    id: 1,
    text: "Go to shop",
  },
  {
    id: 2,
    text: "Buy car",
  },
  {
    id: 3,
    text: "Go for a run",
  },
  {
    id: 4,
    text: "Read a book",
  },
  {
    id: 5,
    text: "Call mom",
  },
];

app.use(bodyParser.json());

const checkExist = (task, res) => {
  if (!task) {
    return res.status(404).json({ message: "Завдання не знайдено" });
  }
};

app.get("/", (req, res) => {
  return res.send("Hello, Express!");
});

app.get("/tasks", (req, res) => {
  return res.status(200).json(tasks);
});

app.post("/tasks", (req, res) => {
  const newTask = req.body;
  tasks.push(newTask);
  return res.status(201).json(newTask);
});

app.get("/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const foundTask = tasks.find((task) => task.id === taskId);
  checkExist(foundTask, res);
  return res.status(200).json(foundTask);
});

app.put("/tasks/:id", (req, res) => {
  const updatedTask = req.body;
  const taskId = parseInt(req.params.id);
  const foundTask = tasks.find((task) => task.id === taskId);
  checkExist(foundTask, res);
  foundTask.text = updatedTask.text;
  return res.status(200).json(foundTask);
});

app.delete("/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  tasks = tasks.filter((t) => t.id !== taskId);
  return res.status(204).json(tasks);
});

app.listen(port, () => {
  console.log(`Server works on http://localhost:${port}`);
});
