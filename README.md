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

---

**Variables / secretos**

Actualmente las claves (`SECRET_KEY`, `REFRESH_SECRET_KEY`) y la URL de MongoDB están hardcodeadas en `server.js`. Se recomienda moverlas a variables de entorno, por ejemplo:

```powershell
set SECRET_KEY=tu_clave
set REFRESH_SECRET_KEY=tu_refresh_clave
set MONGO_URL=mongodb://localhost:27017/cineDB
```

---

**Rutas principales (resumen CRUD y autenticación)**

Autenticación / usuarios:

- POST /register — Registrar usuario. Body: `{ "username": "...", "password": "...", "role": "user|admin" }`.
- POST /login — Login. Body: `{ "username": "...", "password": "..." }`. Responde `accessToken` y `refreshToken`.
- POST /refresh — Intercambia `refreshToken` por un nuevo `accessToken`. Body: `{ "refreshToken": "..." }`.
- GET /profile — Devuelve el perfil del usuario autenticado. (Authorization: `Bearer <accessToken>`)

Usuarios (requieren token y role `admin` para ciertas acciones):

- GET /users — Lista usuarios (admin).
- PUT /users/edit/:id — Edita usuario (admin). Body posible: `{ "username": "...", "password": "...", "role": "..." }`.
- DELETE /users/delete/:id — Elimina usuario (admin).

Películas:

- GET /movies — Lista películas (requiere token).
- POST /movies/add — Agrega película (admin). Body: `{ "title": "...", "director": "...", "genre": "..." }`.
- PUT /movies/edit/:id — Edita película (admin). Body: `{ "title": "...", "director": "...", "genre": "..." }`.
- DELETE /movies/delete/:id — Elimina película (admin).

Notas: todas las rutas que requieren autenticación usan el middleware `authenticateToken` en [server.js](server.js#L1-L400). Para rutas con restricción `admin`, el middleware verifica `req.user.role`.

---

**Ejemplos rápidos (curl)**

1. Registrar:

```bash
curl -X POST http://localhost:3000/register \
	-H "Content-Type: application/json" \
	-d '{"username":"nuevo","password":"pass123","role":"user"}'
```

2. Login:

```bash
curl -X POST http://localhost:3000/login \
	-H "Content-Type: application/json" \
	-d '{"username":"walter","password":"WALTER123"}'
```

3. Usar `accessToken` para obtener películas:

```bash
curl -H "Authorization: Bearer <ACCESS_TOKEN>" http://localhost:3000/movies
```

4. Agregar película (admin):

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
