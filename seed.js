const mongoose = require('mongoose');
const User     = require('./models/User');
const Movie    = require('./models/Movie');

mongoose.connect('mongodb://localhost:27017/cineDB')
    .then(async () => {
        await User.deleteMany();
        await Movie.deleteMany();

        await User.insertMany([
            { username: 'walter',   password: 'WALTER123',   role: 'admin' },
            { username: 'julian',   password: 'julian456',   role: 'user'  },
            { username: 'sandra',   password: 'sandra789',   role: 'user'  },
            { username: 'pedro',    password: 'pedro321',    role: 'user'  },
            { username: 'santiago', password: 'santiago987', role: 'user'  }
        ]);

        await Movie.insertMany([
            { title: 'Inception',     director: 'Christopher Nolan',                    genre: 'Sci-Fi' },
            { title: 'The Matrix',    director: 'Lana Wachowski, Lilly Wachowski',      genre: 'Sci-Fi' },
            { title: 'The Godfather', director: 'Francis Ford Coppola',                 genre: 'Crime'  }
        ]);

        console.log('Datos insertados correctamente ✅');
        mongoose.disconnect();
    });