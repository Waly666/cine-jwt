const express    = require('express');
const jwt        = require('jsonwebtoken');
const mongoose   = require('mongoose');
const bcrypt   = require('bcrypt');
const User       = require('./models/User');
const Movie      = require('./models/Movie');





const app = express();
const SECRET_KEY = "claveCine_123";

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/cineDB')
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error conectando a MongoDB:', err));

app.get('/', (req, res) => {
    res.send('BIENVENIDO A MOVIE ON LINE MDFKs');
});
//ruta de login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('Datos recibidos:', username, password); // 👈 agrega esto

    // 1. Buscar solo por username
    const user = await User.findOne({ username });

    console.log('Usuario encontrado:', user); // 👈 agrega esto

    if (!user) {
        return res.status(401).json({ message: 'Credenciales invalidas MDFKs' });
    }

    // 2. Comparar contraseña con bcrypt
    const passwordValida = await bcrypt.compare(password, user.password);

    console.log('Password valida:', passwordValida); // 👈 agrega esto

    if (!passwordValida) {
        return res.status(401).json({ message: 'Credenciales invalidas MDFKs' });
    }

    const payload = { id: user._id, username: user.username, role: user.role };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '20m' });
    res.json({ message: 'Login exitoso MDFKs', token });
});

//ruta para editar pelicula
app.put ('/movies/edit/:id', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado, solo admins pueden editar peliculas MDFKs' });
    }
    const {title, director, genre} = req.body;
    const movieActualizada = await Movie.findByIdAndUpdate(req.params.id, { title, director, genre }, { new: true }
        
    );
    if (!movieActualizada){
        return res.status(404).json({ message: 'Pelicula no encontrada MDFKs' });
    }
    res.json({ message: 'Pelicula actualizada exitosamente MDFKs', movie: movieActualizada });
});

//
app.delete('/movies/delete/:id', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado, solo admins pueden eliminar peliculas MDFKs' });
    }
    const movieEliminada = await Movie.findByIdAndDelete(req.params.id);
    if (!movieEliminada){
        return res.status(404).json({ message: 'Pelicula no encontrada MDFKs' });
    }   

    res.json({ message: 'Pelicula eliminada exitosamente MDFKs', movie: movieEliminada });
});











//ruta para obtener peliculas
app.get('/movies', authenticateToken, async (req, res) => {
    const movies = await Movie.find();  
    res.json({ message: 'Peliculas disponibles MDFKs', movies });
});
//ruta para agregar pelicula
app.post('/movies/add', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado, solo admins pueden agregar peliculas MDFKs' });
    }
    const { title, director, genre } = req.body;
    const newMovie = new Movie({ title, director, genre });
    await newMovie.save();
    res.json({ message: 'Pelicula agregada exitosamente MDFKs', movie: newMovie });
});
//
app.get('/profile', authenticateToken, (req, res) => {
    res.json({ perfil: req.user });
});
//middleware para autenticar token
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
app.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});


