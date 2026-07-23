const express = require('express');
const app = express();
const port = 3000;
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./openapi.json');
const Database = require('better-sqlite3');
const db = new Database('tasks.db');

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    done BOOLEAN NOT NULL DEFAULT 0
  );
`);

console.log("Database initialized");

const row = db.prepare('SELECT COUNT(*) as total FROM tasks').get()
if (row.total === 0) {
  // Prepare an INSERT statement
  const insert = db.prepare('INSERT INTO tasks (title) VALUES (?)');

  // Insert user data
  insert.run('Comprar leche');
  insert.run('Lavar ropa');
  insert.run('Cocinar lasaña');

}

// Middleware para poder leer JSON en el body de las requests (lo necesitarás en Stage 3)
app.use(express.json());

app.param('id', (req, res, next, id) => {
  const taskId = Number(id);
  if (isNaN(taskId)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
  if (!task) {
    return res.status(404).json({ error: `Task ${id} not found` });
  }

  req.task = task;
  req.taskId = taskId;

  next();
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
app.get('/tasks', (req, res) => {
  if(req.query.done == "true"){
    const doneTasks = db.prepare('SELECT * FROM tasks WHERE done = 1').all();
    return res.json(doneTasks);
  }
  const tasks = db.prepare('SELECT * FROM tasks').all();
  res.json(tasks);
});

// Endpoint para obtener una tarea por su ID
app.get('/tasks/:id', (req, res) => {
  res.json(req.task); // usa lo que dejó el app.param
});

//== 3 ==

// Endpoint para crear una nueva tarea
app.post('/tasks', (req, res) => {
  if(req.body.title==null || req.body.title.trim() === "") {
    return res.status(400).json({ error: "Title is required" });
  }
  
  const newTask = db.prepare('INSERT INTO tasks (title) VALUES (?) ').run(req.body.title);
  const taskDB = db.prepare('SELECT * FROM tasks WHERE id = ?').get(newTask.lastInsertRowid);
  res.status(201).json(taskDB);
});


//== 4 ==
// Endpoint para actualizar una tarea existente
app.put('/tasks/:id', (req, res) => {
  if ((req.body.title == null || req.body.title.trim() === "") && req.body.done == null) {
    return res.status(400).json({ error: "Invalid body" });
  }

  if (req.body.title != null && req.body.title.trim() !== "") {
    const change = db.prepare('UPDATE tasks SET title = ? where id = ? ').run(req.body.title, req.taskId);
  }
  if (req.body.done != null) {
    const change = db.prepare('UPDATE tasks SET done = ? where id = ? ').run(Number(req.body.done), req.taskId);
  }

  const taskUpdated = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.taskId);

  res.json(taskUpdated);
});

// Endpoint para eliminar una tarea existente
app.delete('/tasks/:id', (req, res) => {
  const taskDelete = db.prepare('DELETE FROM tasks WHERE id = ?').run(req.task.id);
  console.log(taskDelete);
  res.status(204).end();
});

//== Extras ==



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});