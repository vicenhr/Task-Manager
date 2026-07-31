# 📝 CRUD API - Task Manager

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![JSON](https://img.shields.io/badge/JSON-000000?style=for-the-badge&logo=json&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)
![Postgres](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)

API REST para la gestión de una lista de tareas (to-do list), desarrollada con Node.js y Express como parte del programa **FlyRank Internship — Backend Track**.

---

## 🛠️ Tecnologías

- **Node.js** — entorno de ejecución
- **Express** — framework para el servidor y las rutas
- **Swagger UI** — documentación interactiva de la API
- **PostgreSQL** — base de datos relacional

---

## 🚀 Instalación y ejecución

```bash
# 1. Clonar el repositorio
git clone https://github.com/vicenhr/crud-api

# 2. Acceder al directorio del proyecto
cd crud-api

# 3. Copiar el archivo de ejemplo de variables de entorno
cp .env.example .env

# 4. Ejecutar la aplicación con Docker Compose
docker compose up
```

El servidor corre en: `http://localhost:3000`

---

## ⚙️ Variables de entorno

Copia `.env.example` a `.env` antes de levantar el proyecto. La variable `DATABASE_URL` contiene la cadena de conexión a la base de datos.

⚠️ `.env` está en `.gitignore` y nunca se sube al repositorio — solo `.env.example` (con valores de ejemplo) queda público.

Además de `DATABASE_URL`, necesitas crear un proyecto gratis en [Supabase](https://supabase.com) y copiar tu `SUPABASE_URL` y `SUPABASE_KEY` (la clave `anon`, nunca la `service_role`) en tu `.env`.

⚠️ En el dashboard de Supabase, en **Authentication → Providers → Email**, desactiva "Confirm email" para poder loguearte inmediatamente después de registrarte.

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
| GET | `/tasks?done=true` | Obtener solo las tareas completadas |

---
## 🔐 Autenticación

La API usa **Supabase Auth** como Identity Provider: gestiona cuentas, contraseñas y JWTs, sin que el backend maneje criptografía directamente.

| Método | Ruta | Descripción | ¿Requiere token? |
|--------|------|-------------|-------------------|
| POST | `/auth/signup` | Crear una cuenta nueva | No |
| POST | `/auth/login` | Autenticarse y obtener un JWT | No |
| POST | `/auth/logout` | Cerrar sesión | Sí (Bearer) |
| GET | `/public/info` | Datos públicos, sin restricción | No |
| GET | `/protected/profile` | Perfil del usuario autenticado | Sí (Bearer) |
| GET | `/protected/dashboard` | Ruta protegida de ejemplo (reutiliza el mismo middleware) | Sí (Bearer) |

### Ejemplo de uso

\`\`\`bash
curl -i -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@ejemplo.com\",\"password\":\"password123\"}"
\`\`\`

---

## 📖 Documentación interactiva (Swagger)

Con el servidor corriendo, visita:

**http://localhost:3000/docs**

![Swagger UI](/images/swagger-ui.png)

### Swagger con Bearer Auth

![Swagger - candado en rutas protegidas](/images/swagger-protected.png)

---

### Prueba del endpoint POST /tasks

![Swagger UI - Try it out POST](/images/swagger-ui-post.png)

![Swagger UI - respuesta POST](/images/swagger-ui-post-tryout.png)

---

## 🗄️ Base de datos (PostgreSQL)

### ¿Por qué PostgreSQL?

Lo elegí porque encaja bien con el tamaño y propósito de este proyecto. Como su nombre indica, es una base de datos robusta y escalable: ofrece un amplio conjunto de características y es ampliamente utilizado en entornos de producción. Para un CRUD como este, es "cero configuración" sin sacrificar SQL real.

### ¿Dónde vive?

La base de datos se ejecuta en un contenedor Docker separado, definido en el archivo `docker-compose.yml`. Esto permite que la API y la base de datos se comuniquen entre sí sin necesidad de instalar PostgreSQL directamente en tu máquina.

### ¿Cómo inspeccionarla?

Con el stack corriendo (`docker compose up`), puedes abrir una consola SQL directamente dentro del contenedor de la base de datos:

```bash
docker exec -it crud-api-db-1 psql -U postgres -d tasks -c "SELECT * FROM tasks;"
```

![Consulta en Postgres](/images/postgres-query.png)

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

## Autor

**Vicente Hernández Ramos** — [@vicenhr](https://github.com/vicenhr)