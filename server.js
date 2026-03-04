const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const SECRET_KEY = "claveCine_123";

app.use(express.json());

const users = [
    { id: 1,  username: 'walter',    password: 'WALTER123',     role: 'admin' },
    { id: 2,  username: 'julian',    password: 'julian456',     role: 'user'  },
    { id: 3,  username: 'sandra',    password: 'sandra789',     role: 'user'  },
    { id: 4,  username: 'pedro',     password: 'pedro321',      role: 'user'  },
    { id: 5,  username: 'santiago',  password: 'santiago987',   role: 'user'  }
];

const movies = [
    { id: 1, title: 'Inception', director: 'Christopher Nolan', genre: 'Sci-Fi' },
    { id: 2, title: 'The Matrix', director: 'Lana Wachowski, Lilly Wachowski', genre: 'Sci-Fi' },
    { id: 3, title: 'The Godfather', director: 'Francis Ford Coppola', genre: 'Crime' },
];

app.get('/', (req, res) => {
    res.send('BIENVENIDO A MOVIE ON LINE MDFKs');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    let user;
    for (let i = 0; i < users.length; i++) {
        if (users[i].username === username && users[i].password === password) {
            user = users[i];
            break;
        }
    }

    if (!user) {
        return res.status(401).json({ message: 'Credenciales invalidas' });
    }

    const payload = { id: user.id, username: user.username, role: user.role };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '20m' });
    res.json({ message: 'Login exitoso MDFKs', token });
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado MDFKs' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token invalido o expirado MDFKs' });
        }
        req.user = user;
        next();
    });
}

app.get('/movies', authenticateToken, (req, res) => {
    res.json({ message: 'Peliculas disponibles MDFKs', movies });
});

app.post('/movies/add', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado, solo admins pueden agregar peliculas MDFKs' });
    }
    const { title, director, genre } = req.body;
    const newMovie = { id: movies.length + 1, title, director, genre };
    movies.push(newMovie);
    res.json({ message: 'Pelicula agregada exitosamente MDFKs', movie: newMovie });
});

app.get('/profile', authenticateToken, (req, res) => {
    res.json({ perfil: req.user });
});

app.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});


