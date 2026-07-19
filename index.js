const express = require('express');
const app = express();
const port = 3000;
const  swaggerUi  =  require ( 'swagger-ui-express' ) ; 
const  swaggerDocument  =  require ( './openapi.json' ) ;

app.use ( '/docs' , swaggerUi.serve , swaggerUi.setup ( swaggerDocument ) ) ;

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

app.param('id', (req, res, next, id) => {
  const taskId = Number(id);
  if(isNaN(id)){
    return res.status(400).json({error: "Unkown ID"});
  }

  const task = tasks.find(t => t.id == taskId);
  if(!task){
    return res.status(404).json({error: `Task ${id} not found`});
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
  // Extra: Query param para filtrar tareas hechas
  if(req.query.done == "true"){
    return res.json(tasks.filter(t => t.done));
  }
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
  
  const maxId = tasks.length === 0 ? 0 : Math.max(...tasks.map(t => t.id));
  const newId = maxId + 1;
  
  var newTask = {
    id: newId,
    title: req.body.title,
    done: false
  }
  
  tasks.push(newTask);
  res.status(201).json(newTask);
});


//== 4 ==
// Endpoint para actualizar una tarea existente
app.put('/tasks/:id', (req, res) => {
  if ((req.body.title == null || req.body.title.trim() === "") && req.body.done == null) {
    return res.status(400).json({ error: "Invalid body" });
  }

  if (req.body.title != null && req.body.title.trim() !== "") {
    req.task.title = req.body.title;
  }
  if (req.body.done != null) {
    req.task.done = req.body.done;
  }

  res.json(req.task);
});

// Endpoint para eliminar una tarea existente
app.delete('/tasks/:id', (req, res) => {
  const index = tasks.findIndex(t => t.id === req.taskId);
  tasks.splice(index, 1);
  res.status(204).end();
});

//== Extras ==



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});