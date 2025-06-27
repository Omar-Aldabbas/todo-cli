const express = require("express");
const cors = require("cors");

const { Client } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

const client = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  database: "todo",
  password: "test123",
});

async function clientConnection() {
  try {
    await client.connect();
    console.log("Connected to DataBase");
  } catch (err) {
    console.error("Connection Faisled", err.stack);
  }
}

clientConnection();

app.get("/tasks", async (req, res) => {
  try {
    const fetch_query = "SELECT * FROM tasks";
    const result = await client.query(fetch_query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database Error" });
  }
});

app.post("/tasks", async (req, res) => {
  const { text, done, createdAt, completedAt, log } = req.body;

  const post_query =
    "INSERT INTO tasks (text, done, createdAt, completedAt, log) VALUES ($1, $2, $3, $4, $5) RETURNING *;";

  const values = [
    text || "NO TEXT",
    done || false,
    createdAt || new Date(),
    completedAt || null,
    log || [],
  ];

  try {
    const result = await client.query(post_query, values);
    res.status(201).json(result.rows[0]);
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
    fields.completedAt = new Date();
    keys.push("completedAt");
  }

  const keys = Object.keys(fields);
  if (keys.length === 0) {
    return res.status(400).json({ error: "No fields to update" });
  }

  const setClauses = keys.map((key, idx) => `${key} = $${idx + 1}`);
  const values = Object.values(fields);
  const query = `
    UPDATE tasks
    SET ${setClauses.join(", ")}
    WHERE id = $${keys.length + 1}
    RETURNING *;
  `;

  values.push(id);

  try {
    const result = await client.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.delete("/tasks/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);

  try {
    const result = await client.query(
      "DELETE FROM tasks WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
