# 📝 CRUD API - Task Manager

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![JSON](https://img.shields.io/badge/JSON-000000?style=for-the-badge&logo=json&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)

API REST para la gestión de una lista de tareas (to-do list), desarrollada con Node.js y Express como parte del programa **FlyRank Internship — Backend Track**.

---

## 🛠️ Tecnologías

- **Node.js** — entorno de ejecución
- **Express** — framework para el servidor y las rutas
- **Swagger UI** — documentación interactiva de la API
- Almacenamiento **en memoria** (sin base de datos — los datos se reinician al reiniciar el servidor)

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

## 🧪 Ejemplo de uso (curl)

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

## Autor

**Vicente Hernández Ramos** — [@vicenhr](https://github.com/vicenhr)