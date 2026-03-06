const express    = require('express');
const jwt        = require('jsonwebtoken');
const mongoose   = require('mongoose');
const bcrypt   = require('bcrypt');
const User       = require('./models/User');
const Movie      = require('./models/Movie');





const app = express();
const SECRET_KEY = "claveCine_123";
const REFRESH_SECRET_KEY = "refreshClaveCine_456"; // 👈 nueva

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

    const user = await User.findOne({ username });
    if (!user) {
        return res.status(401).json({ message: 'Credenciales invalidas MDFKs' });
    }

    const passwordValida = await bcrypt.compare(password, user.password);
    if (!passwordValida) {
        return res.status(401).json({ message: 'Credenciales invalidas MDFKs' });
    }

    const payload = { id: user._id, username: user.username, role: user.role };

    // Generar ambos tokens
    const accessToken  = jwt.sign(payload, SECRET_KEY, { expiresIn: '20m' });
    const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, { expiresIn: '7d' });

    res.json({ message: 'Login exitoso MDFKs', accessToken, refreshToken });
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
app.post('/refresh', (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token no proporcionado MDFKs' });
    }

    jwt.verify(refreshToken, REFRESH_SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Refresh token invalido o expirado MDFKs' });
        }

        // Generar nuevo access token
        const payload     = { id: user.id, username: user.username, role: user.role };
        const accessToken = jwt.sign(payload, SECRET_KEY, { expiresIn: '20m' });

        res.json({ accessToken });
    });
});
app.post('/register', async (req, res) => {
    const { username, password, role } = req.body; // 👈 faltaba esto

    const usuarioExistente = await User.findOne({ username });
    if (usuarioExistente) {
        return res.status(400).json({ message: 'El usuario ya existe MDFKs' });
    }

    const passwordEncriptada = await bcrypt.hash(password, 10);

    const nuevoUsuario = new User({ username, password: passwordEncriptada, role: role || 'user' });
    await nuevoUsuario.save(); // 👈 faltaba esto

    res.status(201).json({ message: 'Usuario registrado exitosamente MDFKs', usuario: { username: nuevoUsuario.username, role: nuevoUsuario.role } });
});

app.put('/users/edit/:id', authenticateToken, async (req, res) => {
    if(req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado, solo admins pueden editar usuarios MDFKs' });
    }
    const { username, password, role } = req.body;

    let datosActualizados = { username, role };

    if (password) {
        datosActualizados.password = await bcrypt.hash(password, 10);
    }
     const usuarioActualizado = await User.findByIdAndUpdate(req.params.id, datosActualizados, { new: true });
    if (!usuarioActualizado) {
        return res.status(404).json({ message: 'Usuario no encontrado MDFKs' });
    }
    res.json({ message: 'Usuario actualizado exitosamente MDFKs', usuario: { username: usuarioActualizado.username, role: usuarioActualizado.role } });
});
app.delete('/users/delete/:id', authenticateToken, async (req, res) => {
    if(req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado, solo admins pueden eliminar usuarios MDFKs' });
    }   
    const usuarioEliminado = await User.findByIdAndDelete(req.params.id);
    if (!usuarioEliminado) {
        return res.status(404).json({ message: 'Usuario no encontrado MDFKs' });
    }
    res.json({ message: 'Usuario eliminado exitosamente MDFKs', usuario: { username: usuarioEliminado.username, role: usuarioEliminado.role } });
});
app.get('/users', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado, solo admins pueden ver los usuarios MDFKs' });
    }

    const users = await User.find({}, { password: 0 }); // 👈 el { password: 0 } oculta la contraseña

    res.json({ message: 'Usuarios disponibles MDFKs', users });
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


