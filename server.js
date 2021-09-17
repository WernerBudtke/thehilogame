const express = require('express')
require('dotenv').config()
require('./config/database')
const session = require('express-session')
const mongo = require('connect-mongodb-session')(session)
const router = require('./routes/index')
const store = new mongo({
    uri: process.env.MONGODB,
    collection: 'sessions'
})

const app = express()

app.use(express.static('public'))

app.set('view engine', 'ejs') // busca las vistas en carpeta views automaticamente + archivos ejs
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: process.env.SECRETORKEY,
    resave: false,
    saveUninitialized: false,
    store: store
}))
const urlControllers = require('./controllers/urlControllers')
app.use('/', urlControllers.checkURL, router)

const PORT = process.env.PORT || 4000
const HOST = process.env.MYHOST || '0.0.0.0'

app.listen(PORT, HOST, () => console.log("Server listening"))
