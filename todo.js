// to start write node todo.js

const axios = require("axios");
const readline = require("readline");



//  Load tasks from the file
async function loadTasks() {
  const res = await axios.get("http://localhost:3000/tasks");
  return res.data;
}

//  Show all
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
    logs.forEach((oneLog) => console.log(`      - ${oneLog}`));
  });
}

async function addTask(taskText) {
  const now = new Date().toISOString();

  const task = {
    text: taskText,
    done: false,
    createdAt: now,
    log: [`Task created at ${now}`],
  };

  await axios.post("http://localhost:3000/tasks", task);
  console.log("🆕 Task added.");
}

//  Mark task as Done
async function markAsDone(taskNumber) {
  const tasks = await loadTasks();
  const i = taskNumber - 1;

  if (!tasks[i]) {
    console.log(" Task not found.");
    return;
  }
  const task = tasks[i];
  const now = new Date().toISOString();
  const updatedTask = {
    done: true,
    completedAt: now,
    log: [...(task.log || []), `Marked done at ${now}`],
  };

  await axios.patch(`http://localhost:3000/tasks/${task.id}`, updatedTask);
  console.log("✅ Task marked as done.");
}

//  Delete task
async function deleteTask(taskNumber) {
  const tasks = await loadTasks();
  const i = taskNumber - 1;

  if (!tasks[i]) {
    console.log(" Task not found.");
    return;
  }
  const task = tasks[i];
  console.log(` Deleting: ${task.text}`);
  console.log("📓 Log:", task.log);

  await axios.delete(`http://localhost:3000/tasks/${task.id}`);
  console.log(" Task deleted.");
}

//  Show help
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

//  make terminal interactive
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
