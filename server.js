require('dotenv').config();

const express = require("express");
const cors = require("cors");

const { DataTypes } = require("sequelize");
const sequelize = require("./config/db.js");
const TodoModel = require("./models/todo.js");

const Todo = TodoModel(sequelize, DataTypes);
const app = express();
app.use(cors());
app.use(express.json());

async function connection() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("Connected to Database");

    const tables = await sequelize.getQueryInterface().showAllTables();
    console.log("Tables in DB:", tables);
  } catch (err) {
    console.error("Connection Faisled", err.stack);
  }
}

connection();

app.get("/tasks", async (req, res) => {
  try {
    const todos = await Todo.findAll();
    res.json(todos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database Error" });
  }
});

app.post("/tasks", async (req, res) => {
  try {
    const { text, done } = req.body;

    const todo = await Todo.create({ text: text || "NO TEXT"});
    res.status(201).json(todo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database Error" });
  }
});

app.patch("/tasks/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const fields = req.body;

  //if done + no value on copmletedat
  if (fields.done === true && !fields.completedAt) {
    delete fields.completedAt;
  }
  delete fields.log;
  delete fields.createdAt;
  delete fields.completedAt;

  const keys = Object.keys(fields);
  if (keys.length === 0) {
    return res.status(400).json({ error: "No fields to update" });
  }

  try {
    const [updatedRows, [updatedTodo]] = await Todo.update(fields, {
      where: { id },
      returning: true,
    });

    if (updatedRows === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(updatedTodo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database Error" });
  }
});

app.delete("/tasks/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const deleted = await Todo.destroy({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database Error" });
  }
});

app.listen(process.env.APP_PORT, () => {
  console.log(`Server running on http://localhost:${process.env.APP_PORT}`);
});
