const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');
const User     = require('./models/User');
const Movie    = require('./models/Movie');

mongoose.connect('mongodb://localhost:27017/cineDB')
    .then(async () => {
        await User.deleteMany();
        await Movie.deleteMany();

        const users = [
            { username: 'walter',   password: 'WALTER123',   role: 'admin' },
            { username: 'julian',   password: 'julian456',   role: 'user'  },
            { username: 'sandra',   password: 'sandra789',   role: 'user'  },
            { username: 'pedro',    password: 'pedro321',    role: 'user'  },
            { username: 'santiago', password: 'santiago987', role: 'user'  }
        ];

        // Encriptar cada contraseña antes de guardar
        const usersEncriptados = await Promise.all(
            users.map(async (u) => ({
                ...u,
                password: await bcrypt.hash(u.password, 10)
            }))
        );

        await User.insertMany(usersEncriptados);

        await Movie.insertMany([
            { title: 'Inception',     director: 'Christopher Nolan',               genre: 'Sci-Fi' },
            { title: 'The Matrix',    director: 'Lana Wachowski, Lilly Wachowski', genre: 'Sci-Fi' },
            { title: 'The Godfather', director: 'Francis Ford Coppola',            genre: 'Crime'  }
        ]);

        console.log('Datos insertados con contraseñas encriptadas ✅');
        mongoose.disconnect();
    });