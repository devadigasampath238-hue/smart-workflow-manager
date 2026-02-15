const path = require("path");

const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = "tasks.json";

// Load tasks from file
function loadTasks() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE));
  } catch {
    return [];
  }
}

// Save tasks to file
function saveTasks(tasks) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
}

// GET tasks
app.get("/tasks", (req, res) => {
  const tasks = loadTasks();
  res.json(tasks);
});

// ADD task
app.post("/tasks", (req, res) => {
  const tasks = loadTasks();
  tasks.push({ text: req.body.task, completed: false });
  saveTasks(tasks);
  res.json({ success: true });
});

// TOGGLE completion
app.put("/tasks/:index", (req, res) => {
  const tasks = loadTasks();
  tasks[req.params.index].completed = !tasks[req.params.index].completed;
  saveTasks(tasks);
  res.json({ success: true });
});

// DELETE task
app.delete("/tasks/:index", (req, res) => {
  const tasks = loadTasks();
  tasks.splice(req.params.index, 1);
  saveTasks(tasks);
  res.json({ success: true });
});
// Serve frontend files
app.use(express.static(path.join(__dirname, "../")));


// Deploy-ready port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
