const {Sequelize} = require('sequelize');

const sequelize = new Sequelize('pokedex', 'postgres', '', {
    host: 'localhost',
    dialect: 'postgres',
});

module.exports = sequelize;