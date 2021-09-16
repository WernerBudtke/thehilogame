const express = require('express')
const router = express.Router()
const viewsControllers = require('../controllers/viewsControllers')
const userControllers = require('../controllers/userControllers')
router.route('/')
.get(viewsControllers.home)
router.route('/register')
.get(viewsControllers.register)
.post(userControllers.register)
router.route('/login')
.get(viewsControllers.login)
.post(userControllers.login)
router.route('/highscores')
.get(viewsControllers.highscore)
router.route('/options')
.get(viewsControllers.options)
router.route('/user/remove/:user')
.get(userControllers.removeUser)
router.route('/roll')
.post(userControllers.playGame)
router.route('/logout')
.get(userControllers.logout)
module.exports = router