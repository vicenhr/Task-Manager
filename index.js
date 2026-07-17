const express = require('express');
const app = express();
const port = 3000;

var tasks = [
  {
    id: 1,
    title: "First Task",
    done: true
  },
  {
    id: 2,
    title: "Second Task",
    done: true
  },
  {
    id: 3,
    title: "Third Task",
    done: true
  }
];

// Middleware para poder leer JSON en el body de las requests (lo necesitarás en Stage 3)
app.use(express.json());


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


// Endpoint para obtener todas las tareas
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// Endpoint para obtener una tarea por su ID
app.get('/tasks/:id', (req, res) => {
  var taskId = Number(req.params.id);  
  if (isNaN(taskId)){
    return res.status(400).json({ error: "Invalid task ID" });
  }
  var task = tasks.find(t => t.id === taskId);
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }
  res.json(task);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});