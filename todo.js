const axios = require("axios");
const readline = require("readline");

require("dotenv").config();
const protocol = process.env.PROTOCOL || 'http';
const API_URL = `${PROTOCOL}://${process.env.HOST}:${process.env.APP_PORT}`;



async function loadTasks() {
  const res = await axios.get(`${PROTOCOL}://${process.env.HOST}:${process.env.APP_PORT}/tasks`);
  return res.data;
}

async function showTasks() {
  const tasks = await loadTasks();

  if (tasks.length === 0) {
    console.log("📭 No tasks found.");
    return;
  }

  tasks.forEach((task, i) => {
    const status = task.done ? "✅" : "❌";
    const createdTime = task.createdAt || "Unknown";
    const doneTime = task.completedAt || "Not completed";
    const logs = task.log || [];

    console.log(`${i + 1}. ${task.text} [${status}]`);
    console.log(`  📅 Created:   ${createdTime}`);
    console.log(`  ✅ Completed: ${doneTime}`);
    console.log(`  📓 Log:`);
    logs.forEach(logEntry => console.log(`      - ${logEntry}`));
  });
}

async function addTask(taskText) {
  const task = {
    text: taskText,
    done: false,
  };

  await axios.post(`${PROTOCOL}://${process.env.HOST}:${process.env.APP_PORT}/tasks`, task);
  console.log("🆕 Task added.");
}

async function markAsDone(taskNumber) {
  const tasks = await loadTasks();
  const index = taskNumber - 1;

  if (!tasks[index]) {
    console.log("Task not found.");
    return;
  }

  const task = tasks[index];

  const updatedTask = {
    done: true,
    // completedAt and log handled by backend/db
  };

  await axios.patch(`${PROTOCOL}://${process.env.HOST}:${process.env.APP_PORT}/tasks/tasks/${task.id}`, updatedTask);
  console.log("✅ Task marked as done.");
}

async function deleteTask(taskNumber) {
  const tasks = await loadTasks();
  const index = taskNumber - 1;

  if (!tasks[index]) {
    console.log("Task not found.");
    return;
  }

  const task = tasks[index];
  console.log(`Deleting: ${task.text}`);

  await axios.delete(`${PROTOCOL}://${process.env.HOST}:${process.env.APP_PORT}/tasks/tasks/${task.id}`);
  console.log("Task deleted.");
}

function showHelp() {
  console.log(`
📘 Available commands:
  list             Show all tasks
  add Task text    Add a new task
  done 2           Mark task 2 as done
  delete 1         Delete task 1
  help             Show this help
  exit             Close the app
`);
}

const ask = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "📃 Type a command (or 'help'): ",
});

console.log("📃 Welcome to your To-Do CLI!");
ask.prompt();

ask.on("line", async (line) => {
  const [cmd, ...args] = line.trim().split(" ");
  const text = args.join(" ");

  switch (cmd) {
    case "list":
      await showTasks();
      break;
    case "add":
      await addTask(text);
      break;
    case "done":
      await markAsDone(Number(args[0]));
      break;
    case "delete":
      await deleteTask(Number(args[0]));
      break;
    case "help":
      showHelp();
      break;
    case "exit":
      console.log("👋 Bye! Take care.");
      ask.close();
      return;
    default:
      console.log("❓ Unknown command. Try 'help'");
  }

  ask.prompt();
});
