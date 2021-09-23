const Sequelize = require('sequelize')
const database = require('../config/database')

const User = database.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    username: {
        type: Sequelize.STRING(16),
        unique: true,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING(255),
        allowNull: false,
        validate: {
            len: [4, 255]
        }
    },
    highscore: { 
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    tries: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    wins: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    score: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    roll: {
        type: Sequelize.INTEGER,
        defaultValue: 5000,
    },
})
module.exports = User