const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "tasks.json");

function loadTasks() {
  if (!fs.existsSync(FILE)) return [];
  return JSON.parse(fs.readFileSync(FILE));
}

function saveTasks(tasks) {
  fs.writeFileSync(FILE, JSON.stringify(tasks, null, 2));
}

function listTasks() {
  const tasks = loadTasks();
  if (tasks.length === 0) {
    console.log("📭 No tasks found.");
    return;
  }

  tasks.forEach((task, index) => {
    const status = task.done ? "✅" : "❌";
    const created = task.createdAt || "Unknown";
    const completed = task.completedAt || "Not completed";

    console.log(`${index + 1}. ${task.text} [${status}]`);
    console.log(`    📅 Created:   ${created}`);
    console.log(`    ✅ Completed: ${completed}`);
  });
}

function addTask(text) {
  const tasks = loadTasks();
  const now = new Date();
  const createdAt = `${now.getHours()}:${now.getMinutes()} ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;

  tasks.push({ text, done: false, createdAt });
  saveTasks(tasks);
  console.log("➕ Task added.");
}

function markDone(index) {
  const tasks = loadTasks();
  const i = index - 1;

  if (!tasks[i]) {
    console.log("⚠️ Invalid task number.");
    return;
  }

  const now = new Date();
  const completedAt = `${now.getHours()}:${now.getMinutes()} ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;

  tasks[i].done = true;
  tasks[i].completedAt = completedAt;

  saveTasks(tasks);
  console.log("✅ Task marked as done at", completedAt);
}

function deleteTask(index) {
  const tasks = loadTasks();
  if (!tasks[index - 1]) {
    console.log("⚠️ Invalid task number.");
    return;
  }
  tasks.splice(index - 1, 1);
  saveTasks(tasks);
  console.log("🗑 Task deleted.");
}

function showHelp() {
  console.log(`
📃 To-Do CLI Tool

How to use 📃:
  node todo.js list              View all tasks
  node todo.js add "Task name"   Add a new task
  node todo.js done 2            Mark task #2 as done
  node todo.js delete 3          Delete task #3
  node todo.js help              Show this help message
  `);
}

const [, , command, ...args] = process.argv;

switch (command) {
  case "list":
    listTasks();
    break;
  case "add":
    addTask(args.join(" "));
    break;
  case "done":
    markDone(Number.parseInt(args[0]));
    break;
  case "delete":
    deleteTask(Number.parseInt(args[0]));
    break;
  case "help":
  default:
    showHelp();
}
