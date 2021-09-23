const express = require('express')
require('dotenv').config()
require('./config/database')
const session = require('express-session')
const database = require('./config/database')
const SequelizeStore = require('connect-session-sequelize')(session.Store)
const router = require('./routes/index')

const app = express()

app.use(express.static('public'))

app.set('view engine', 'ejs') // busca las vistas en carpeta views automaticamente + archivos ejs
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: process.env.SECRETORKEY,
    resave: false,
    saveUninitialized: false,
    store: new SequelizeStore({
        db: database
    })
}))
const urlControllers = require('./controllers/urlControllers')


const PORT = process.env.PORT || 4000
const HOST = process.env.MYHOST || '0.0.0.0'
// si tuviera dos modelos relacionados. debo poner losMuchos.belongsTo(elUno) va antes del SYNC y arriba hay q requerir los 2 modelos.
database.sync()
.then(() =>{
    app.use('/', urlControllers.checkURL, router)
    app.listen(PORT, HOST, () => console.log("Server listening"))
})



