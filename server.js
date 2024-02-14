const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

const cors = require("cors"); // Import the cors middleware

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // Use the cors middleware

app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:3001", // Allow requests only from this origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow only specified HTTP methods
  })
);
const db = new sqlite3.Database("C:UserskrishTOdotasks.db");

db.serialize(() => {
  db.run(
    "CREATE TABLE tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, completed BOOLEAN)"
  );
});

app.get("/tasks", (req, res) => {
  db.all("SELECT * FROM tasks", (err, rows) => {
    if (err) {
      res
        .status(500)
        .json({ error: "An error occurred while retrieving tasks." });
    } else {
      res.json(rows);
    }
  });
});

app.post("/tasks", (req, res) => {
  const { title, description } = req.body;
  db.run(
    "INSERT INTO tasks (title, description, completed) VALUES (?, ?, ?)",
    [title, description, false],
    (err) => {
      if (err) {
        res
          .status(500)
          .json({ error: "An error occurred while adding a task." });
      } else {
        res.json({ id: this.lastID, title, description, completed: false });
      }
    }
  );
});

app.put("/tasks/:id", (req, res) => {
  const { completed } = req.body;
  db.run(
    "UPDATE tasks SET completed = ? WHERE id = ?",
    [completed, req.params.id],
    (err) => {
      if (err) {
        res
          .status(500)
          .json({ error: "An error occurred while updating the task." });
      } else {
        res.json({ id: req.params.id, completed });
      }
    }
  );
});

app.delete("/tasks/:id", (req, res) => {
  db.run("DELETE FROM tasks WHERE id = ?", req.params.id, (err) => {
    if (err) {
      res
        .status(500)
        .json({ error: "An error occurred while deleting the task." });
    } else {
      res.json({ id: req.params.id, deleted: true });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
