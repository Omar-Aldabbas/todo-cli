# Todo CLI

A simple command-line to-do list application built with Node.js, connected to a PostgreSQL database for persistent task management.

---

## Features

- Interactive CLI to add, list, mark done, and delete tasks  
- Tasks include creation and completion timestamps  
- Task logs track history of updates  
- Backend API built with Express.js connected to PostgreSQL  

---

## Setup & Run

1. Ensure PostgreSQL is installed and running with a database named `todo` and a `tasks` table.  
2. Install dependencies:

```bash
npm install

```bash
 node todo.js   # TO Start
 list           # Show all tasks
 add "Task"     # Add a new task
 done 2         # Mark task #2 as done
 delete 3       # Delete task #3
 help           # Show help message
