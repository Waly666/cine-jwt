# cine-jwt

Proyecto ejemplo de backend con autenticación basada en JWT y rutas CRUD para películas y usuarios.

**Resumen rápido**: servidor Node.js + Express, MongoDB (mongoose), autenticación con `jsonwebtoken` y contraseñas con `bcrypt`.

---

**Requisitos**

- Node.js 14+ y npm
- MongoDB (local o remoto)

**Instalación**

1. Instalar dependencias:

```powershell
npm install
```

2. Crear/ejecutar MongoDB y asegurarse de que la base de datos `cineDB` esté disponible (por defecto usa `mongodb://localhost:27017/cineDB`).

3. (Opcional) Ingresar datos de ejemplo con el script `seed.js`:

```powershell
node seed.js
```

---

**Ejecución**

```powershell
node server.js
```

El servidor escucha por defecto en el puerto `3000`.

---

**Archivos relevantes**

- [server.js](server.js#L1-L400) — servidor y rutas.
- [models/User.js](models/User.js#L1-L400) — esquema `User` (username, password, role).
- [models/Movie.js](models/Movie.js#L1-L400) — esquema `Movie` (title, director, genre).
- [seed.js](seed.js#L1-L400) — script para poblar la base de datos con usuarios y películas de ejemplo.
- [test-bcrypt.js](test-bcrypt.js#L1-L400) — pequeña prueba de `bcrypt` contra la BD.
- [server.js](server.js#L1-L400) — servidor y punto de entrada.
- [routes/auth.routes.js](routes/auth.routes.js#L1-L50) — rutas de autenticación (`/auth`).
- [routes/movie.routes.js](routes/movie.routes.js#L1-L80) — rutas de películas (`/movies`).
- [routes/user.routes.js](routes/user.routes.js#L1-L80) — rutas de usuarios (`/users`).
- [controllers/*](controllers) — lógica por recurso (`auth`, `movie`, `user`).
- [services/*](services) — capa de servicios que interactúa con los modelos.
- [models/User.js](models/User.js#L1-L50) — esquema `User` (username, password, role).
- [models/Movie.js](models/Movie.js#L1-L50) — esquema `Movie` (title, director, genre).
- [seed.js](seed.js#L1-L400) — script para poblar la base de datos con usuarios y películas de ejemplo.
- [test-bcrypt.js](test-bcrypt.js#L1-L400) — pequeña prueba de `bcrypt` contra la BD.

---

**Variables / secretos**

El proyecto ahora usa `dotenv` y variables de entorno. Crea un archivo `.env` en la raíz con al menos estas variables:

```dotenv
PORT=3000
MONGO_URI=mongodb://localhost:27017/cineDB
SECRET_KEY=tu_clave_secreta
REFRESH_SECRET_KEY=tu_clave_refresh
```

Evita subir `.env` a repositorios públicos. Agrega `.env` a `.gitignore` si es necesario.

---

**Rutas principales (resumen CRUD y autenticación)**

El servidor expone rutas organizadas por prefijo.

Prefijos:
- `/auth` — Autenticación
- `/users` — Gestión de usuarios
- `/movies` — Gestión de películas

Autenticación:

- POST `/auth/login` — Login. Body: `{ "username": "...", "password": "..." }`. Responde `accessToken` y `refreshToken`.
- POST `/auth/refresh` — Intercambia `refreshToken` por un nuevo `accessToken`. Body: `{ "refreshToken": "..." }`.

Usuarios:

- POST `/users/register` — Registrar usuario. Body: `{ "username": "...", "password": "...", "role": "user|admin" }`.
- GET `/users/` — Lista usuarios (requiere token y role `admin`).
- PUT `/users/edit/:id` — Edita usuario (requiere `admin`).
- DELETE `/users/delete/:id` — Elimina usuario (requiere `admin`).

Películas:

- GET `/movies/` — Lista películas (requiere token autenticado).
- POST `/movies/add` — Agrega película (requiere `admin`). Body: `{ "title": "...", "director": "...", "genre": "..." }`.
- PUT `/movies/edit/:id` — Edita película (requiere `admin`).
- DELETE `/movies/delete/:id` — Elimina película (requiere `admin`).

Autenticación y autorización:

- El middleware `authenticateToken` valida `accessToken` (ver [middlewares/auth.middleware.js](middlewares/auth.middleware.js#L1-L100)).
- El middleware `isAdmin` verifica `req.user.role === 'admin'` para rutas protegidas (ver [middlewares/auth.middleware.js](middlewares/auth.middleware.js#L1-L100)).

---

**Ejemplos rápidos (curl)**

1) Registrar (POST `/users/register`):

```bash
curl -X POST http://localhost:3000/users/register \
	-H "Content-Type: application/json" \
	-d '{"username":"nuevo","password":"pass123","role":"user"}'
```

2) Login (POST `/auth/login`):

```bash
curl -X POST http://localhost:3000/auth/login \
	-H "Content-Type: application/json" \
	-d '{"username":"walter","password":"WALTER123"}'
```

3) Obtener películas (GET `/movies/`):

```bash
curl -H "Authorization: Bearer <ACCESS_TOKEN>" http://localhost:3000/movies
```

4) Agregar película (POST `/movies/add`, admin):

```bash
curl -X POST http://localhost:3000/movies/add \
	-H "Authorization: Bearer <ACCESS_TOKEN>" \
	-H "Content-Type: application/json" \
	-d '{"title":"Nueva","director":"Alguien","genre":"Drama"}'
```

---

**Modelos (resumen)**

- `User` (`models/User.js`): `username` (String, unique), `password` (String), `role` (String).
- `Movie` (`models/Movie.js`): `title` (String), `director` (String), `genre` (String).

---

**Scripts útiles**

- `node seed.js` — Población inicial con usuarios (incluye contraseña en claro en el archivo, pero se encripta antes de insertar) y algunas películas.
- `node test-bcrypt.js` — Muestra cómo comparar una contraseña con la almacenada.

---

**Buenas prácticas / notas de seguridad**

- Mover claves y URIs de base de datos a variables de entorno.
- No incluir secretos en commits públicos.
- Ajustar los tiempos de expiración de tokens según necesidades.

---

Si quieres, puedo:

- Subir (commit + push) este `README.md` al remoto (ya tengo permiso para commitear localmente).
- Cambiar `server.js` para usar variables de entorno en lugar de claves hardcodeadas.

Contacto: Waly666
