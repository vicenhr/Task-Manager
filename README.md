# 📝 CRUD API - Task Manager

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![JSON](https://img.shields.io/badge/JSON-000000?style=for-the-badge&logo=json&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)

API REST para la gestión de una lista de tareas (to-do list), desarrollada con Node.js y Express como parte del programa **FlyRank Internship — Backend Track**.

---

## 🛠️ Tecnologías

- **Node.js** — entorno de ejecución
- **Express** — framework para el servidor y las rutas
- **Swagger UI** — documentación interactiva de la API
- **SQLite** (`better-sqlite3`) — almacenamiento persistente en un único archivo (`tasks.db`)


---

## 🚀 Instalación y ejecución

```bash
# 1. Clonar el repositorio
git clone https://github.com/vicenhr/crud-api
cd crud-api

# 2. Instalar dependencias
npm install

# 3. Levantar el servidor
node index.js
```

El servidor corre en: `http://localhost:3000`

---

## 📌 Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Información general de la API |
| GET | `/health` | Verificar el estado de la API |
| GET | `/tasks` | Obtener todas las tareas |
| POST | `/tasks` | Crear una nueva tarea |
| GET | `/tasks/:id` | Obtener una tarea específica |
| PUT | `/tasks/:id` | Actualizar una tarea existente |
| DELETE | `/tasks/:id` | Eliminar una tarea existente |

---

## 📖 Documentación interactiva (Swagger)

Con el servidor corriendo, visita:

**http://localhost:3000/docs**

![Swagger UI](/images/swagger-ui.png)

### Prueba del endpoint POST /tasks

![Swagger UI - Try it out POST](/images/swagger-ui-post.png)

![Swagger UI - respuesta POST](/images/swagger-ui-post-tryout.png)

---

## 🗄️ Base de datos (SQLite)

### ¿Por qué SQLite?

Lo elegí porque encaja bien con el tamaño y propósito de este proyecto. Como su nombre indica, es una base de datos ligera: no requiere levantar un servidor de base de datos aparte ni configurar una conexión — toda la base vive y se administra dentro de un único archivo, en el mismo lugar donde corre la aplicación. Para un CRUD como este, es "cero configuración" sin sacrificar SQL real.

### ¿Dónde vive?

La base de datos vive en un archivo independiente, `tasks.db`, ubicado en la raíz del proyecto. Se crea automáticamente la primera vez que arranca el servidor — no requiere ningún paso manual. Este archivo está en `.gitignore`, así que no se sube al repositorio: cada clon del proyecto genera su propio `tasks.db` limpio, con las tres tareas de ejemplo sembradas.

Se puede inspeccionar directamente, sin pasar por la API, abriéndolo con [DB Browser for SQLite](https://sqlitebrowser.org/) o corriendo comandos SQL tradicionales contra él.

### Consulta de ejemplo

```sql
select count(*) from tasks;
```

![DB Browser - conteo de tareas](/images/db-browser-query.png)

Esta consulta corrida justo después de que el servidor sembrara los datos iniciales (antes de crear ninguna tarea adicional) devuelve `3` — confirmando que la semilla de Stage 0 insertó exactamente las tres tareas esperadas, ni una más.

---

## 💻 Ejemplo de uso (curl)

```bash
curl -i -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d "{\"title\":\"Comprar leche\"}"
```

**Respuesta:**

```
HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 45
ETag: W/"2d-ODRPfXFqgQnjiKwnRXwqasxyto4"
Date: Fri, 17 Jul 2026 21:04:47 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"id":4,"title":"Comprar leche","done":false}
```

---

## 🧪 The mortality experiment

"create a few tasks, restart your server, GET /tasks . Write two sentences in your README about what happened and why. This observation is the entire reason Week 3 exists"

The data was reset due to the fact that the array is on memory, it disappears when the server is restarted. This is the reason why we need to use a database to store data persistently.

NOTA: Esto ya no ocurre desde la migración a SQLite.

---

## Autor

**Vicente Hernández Ramos** — [@vicenhr](https://github.com/vicenhr)