const Sequelize = require('sequelize')
const database = new Sequelize('thehilogame','root','',{
    host: 'localhost',
    dialect: 'mysql'
}) // bd, user, contrasena
module.exports = database