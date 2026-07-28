require('dotenv').config();

const express = require('express');
const app = express();
const port = 3000;
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./openapi.json');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      done BOOLEAN NOT NULL DEFAULT false
    );
  `);

  console.log("Database initialized");

  const result = await pool.query('SELECT COUNT(*) AS total FROM tasks');
  if (Number(result.rows[0].total) === 0) {
    await pool.query('INSERT INTO tasks (title) VALUES ($1)', ['Comprar leche']);
    await pool.query('INSERT INTO tasks (title) VALUES ($1)', ['Lavar ropa']);
    await pool.query('INSERT INTO tasks (title) VALUES ($1)', ['Cocinar lasaña']);
  }
}

async function main() {
  await initDb();
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

main();

// Middleware para poder leer JSON en el body de las requests (lo necesitarás en Stage 3)
app.use(express.json());

app.param('id', async (req, res, next, id) => {
  const taskId = Number(id);
  if (isNaN(taskId)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    const task = await pool.query('SELECT * FROM tasks WHERE id = $1', [taskId]);
    if (!task.rows[0]) {
      return res.status(404).json({ error: `Task ${id} not found` });
    }

    req.task = task.rows[0];
    req.taskId = taskId;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//== 1 ==

// Endpoint para obtener información de la API
app.get('/', (req, res) => {
  res.json({
    name: "Task API",
    version: "1.0",
    endpoints: ["/tasks"]
  });
});

// Endpoint para obtener el estado de la API
app.get('/health', (req, res) => {
  res.json({ status: "ok" });
});

//== 2 ==

// Endpoint para obtener todas las tareas
app.get('/tasks', async (req, res) => {
  if (req.query.done == "true") {
    const doneTasks = await pool.query('SELECT * FROM tasks WHERE done = true');
    return res.json(doneTasks.rows);
  }
  const result = await pool.query('SELECT * FROM tasks');
  res.json(result.rows);
});

// Endpoint para obtener una tarea por su ID
app.get('/tasks/:id', async (req, res) => {
  res.json(req.task); // usa lo que dejó el app.param
});

//== 3 ==

// Endpoint para crear una nueva tarea
app.post('/tasks', async (req, res) => {
  if (req.body.title == null || req.body.title.trim() === "") {
    return res.status(400).json({ error: "Title is required" });
  }

  try {
    const newTask = await pool.query('INSERT INTO tasks (title) VALUES ($1) RETURNING *', [req.body.title]);
    res.status(201).json(newTask.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


//== 4 ==
// Endpoint para actualizar una tarea existente
app.put('/tasks/:id', async (req, res) => {
  if ((req.body.title == null || req.body.title.trim() === "") && req.body.done == null) {
    return res.status(400).json({ error: "Invalid body" });
  }

  try {
    if (req.body.title != null && req.body.title.trim() !== "") {
      const change = await pool.query('UPDATE tasks SET title = $1 where id = $2', [req.body.title, req.taskId]);
    }
    if (req.body.done != null) {
      const change = await pool.query('UPDATE tasks SET done = $1 where id = $2', [Boolean(req.body.done), req.taskId]);
    }

    const taskUpdated = await pool.query('SELECT * FROM tasks where id = $1', [req.taskId]);
    res.json(taskUpdated.rows[0]);
  }catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint para eliminar una tarea existente
app.delete('/tasks/:id', async(req, res) => {
  try{
    const taskDelete = await pool.query('DELETE FROM tasks WHERE id = $1', [req.taskId]);
    res.status(204).end();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
