const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/cineDB')
    .then(async () => {
        const user = await User.findOne({ username: 'walter' });
        console.log('Password en DB:', user.password);
        
        const resultado = await bcrypt.compare('WALTER123', user.password);
        console.log('Resultado compare:', resultado);
        
        mongoose.disconnect();
    });