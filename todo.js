

// to start write node todo.js

const fs = require("fs");
const path = require("path");
const readline = require("readline");

//  File path
const FILE = path.join(__dirname, "tasks.json");

//  Load tasks from the file
function loadTasks() {
  if (!fs.existsSync(FILE)) return [];
  return JSON.parse(fs.readFileSync(FILE));
}

//  Save tasks in file
function saveTasks(allTasks) {
  fs.writeFileSync(FILE, JSON.stringify(allTasks, null, 2));
}

//  Show all
function showTasks() {
  const tasks = loadTasks();

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
    console.log(`    📅 Created:   ${createdTime}`);
    console.log(`    ✅ Completed: ${doneTime}`);
    console.log(`    📓 Log:`);
    logs.forEach(oneLog => console.log(`      - ${oneLog}`));
  });
}

//  Add task
function addTask(taskText) {
  const tasks = loadTasks();
  const now = new Date().toISOString();

  tasks.push({
    text: taskText,
    done: false,
    createdAt: now,
    log: [`Task created at ${now}`]
  });

  saveTasks(tasks);
  console.log("🆕 Task added.");
}

//  Mark task as Done
function markAsDone(taskNumber) {
  const tasks = loadTasks();
  const i = taskNumber - 1;

  if (!tasks[i]) {
    console.log("⚠️ Task not found.");
    return;
  }

  const now = new Date().toISOString();
  tasks[i].done = true;
  tasks[i].completedAt = now;
  tasks[i].log = tasks[i].log || [];
  tasks[i].log.push(`Marked done at ${now}`);

  saveTasks(tasks);
  console.log("✅ Task marked as done.");
}

//  Delete task
function deleteTask(taskNumber) {
  const tasks = loadTasks();
  const i = taskNumber - 1;

  if (!tasks[i]) {
    console.log("⚠️ Task not found.");
    return;
  }

  console.log(`🗑️ Deleting: ${tasks[i].text}`);
  console.log("📓 Log:", tasks[i].log);

  tasks.splice(i, 1);
  saveTasks(tasks);
  console.log("🗑️ Task deleted.");
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
  prompt: "📃 Type a command (or 'help'): "
});

console.log("📃 Welcome to your To-Do CLI!");
ask.prompt();

ask.on("line", line => {
  const [cmd, ...args] = line.trim().split(" ");
  const text = args.join(" ");

  switch (cmd) {
    case "list":
      showTasks();
      break;
    case "add":
      addTask(text);
      break;
    case "done":
      markAsDone(Number(args[0]));
      break;
    case "delete":
      deleteTask(Number(args[0]));
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
