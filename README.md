# Todo CLI Application

This Todo CLI application is a command-line tool built with Node.js that allows you to manage your to-do tasks efficiently. It uses Express for handling HTTP requests, Sequelize ORM to interact with a PostgreSQL database, and Axios for making HTTP requests within the CLI interface. The app supports adding new tasks, listing existing ones, marking tasks as done, and deleting tasks directly from your terminal.

## Features

- Add tasks with descriptions
- List all tasks with status and timestamps
- Mark tasks as completed
- Delete tasks by their number
- Simple and intuitive command-line interface
- Persistent task storage using PostgreSQL
- Configuration via environment variables for flexibility and security

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- PostgreSQL database installed and running
- npm package manager

### Installation

1. Clone this repository:
   ```bash
   git clone <https://github.com/Omar-Aldabbas/todo-cli.git>
   cd todo-cli
2. Install dependencies:
   ```bash
   npm install "dependiencies"
3. Set up your environment variables by copying the example file and editing it:
   ```bash
   cp .env.example .env

## Run the Application
  ```bash
  npm run server.js
  node todo.js
```

## Usage

```bash
 node todo.js   # TO Start
 list           # Show all tasks
 add "Task"     # Add a new task
 done 2         # Mark task #2 as done
 delete 3       # Delete task #3
 help           # Show help message
