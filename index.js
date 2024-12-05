const express = require("express");
const bodyParser = require("body-parser");
const app = express();

/*
Uncomment this for sqlite
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbName);
*/

const { Task } = require("./models/taskModel");

const dbName = "tasks.db";
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

//Connecting to MongoDB
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/tasks", {})
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

app.use(bodyParser.json());

const checkExist = (task, res, err) => {
  if (!task) {
    return res.status(404).json({ message: err ?? "Завдання не знайдено" });
  }
};

const serverError = (err, res) => {
  if (err) {
    return res.status(500).json({ error: err.message });
  }
};

app.get("/", (req, res) => {
  return res.send("Hello, Express!");
});

app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();

    return res.status(200).json(tasks);
  } catch (e) {
    console.error("Task creation error: ", e);
    return res.status(500).json({ error: e.message });
  }
});

app.post("/tasks", async (req, res) => {
  try {
    const newTask = req.body;
    const task = await Task.create({
      text: newTask.text,
    });

    if (!task) {
      return res.status(404).json({ message: "Завдання не створене" });
    }

    return res.status(201).json(task);
  } catch (e) {
    console.error("Task creation error: ", e);
    return res.status(500).json({ error: e.message });
  }
});

app.get("/tasks/:id", async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: err ?? "Завдання не знайдено" });
    }

    return res.status(200).json(task);
  } catch (e) {
    console.error("Task creation error: ", e);
    return res.status(500).json({ error: e.message });
  }
});

app.put("/tasks/:id", async (req, res) => {
  try {
    const { text, isCompleted } = req.body;
    const taskId = req.params.id;

    const task = await Task.findByIdAndUpdate(
      taskId,
      { text, isCompleted },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: err ?? "Завдання не знайдено" });
    }

    return res.status(200).json(task);
  } catch (e) {
    console.error("Task creation error: ", e);
    return res.status(500).json({ error: e.message });
  }
});

app.delete("/tasks/:id", async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findByIdAndDelete(taskId);

    if (!task) {
      return res.status(404).json({ message: err ?? "Завдання не знайдено" });
    }

    return res.status(204).send();
  } catch (e) {
    console.error("Task creation error: ", e);
    return res.status(500).json({ error: e.message });
  }
});

app.listen(port, () => {
  console.log(`Server works on http://localhost:${port}`);
});
