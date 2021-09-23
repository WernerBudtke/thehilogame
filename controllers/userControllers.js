const User = require('../models/User')
const bcryptjs = require('bcryptjs')
const userControllers = {
    register: async (req, res)  => {
        const {username, password} = req.body
        let hashedPass = bcryptjs.hashSync(password)
        let newUser = {
            username,
            password: hashedPass
        }
        try{
            await User.create(newUser)
            res.render('login', {
                loggedIn: false,
                user: null,
                title: 'Log In',
                error: null,
                userCreated: true
            })
        }catch(e){
            res.render('register', {
                loggedIn: false,
                user: null,
                title: 'Register',
                error: e.message
            })
        }
    },
    login: async (req, res) => {
        const {password, username} = req.body
        const errMsg = 'Invalid User or Password'
        try{
            let userFound = await User.findAll({
                raw: true,
                where: {
                    username: username
                }
            })
            if(!userFound)throw new Error(errMsg)
            if(!bcryptjs.compareSync(password, userFound[0].password))throw new Error(errMsg)
            userFound[0].password = null
            req.session.loggedUser = userFound[0]
            req.session.loggedIn = true
            res.render('index', {
                user: userFound[0],
                title: 'Home',
                error: null,
                loggedIn: true
            })
        }catch(e){
            res.render('login', {
                title: 'Log In',
                error: e.message,
                user: null,
                userCreated: null,
                loggedIn: false
            })
        }
        
    },
    removeUser: async (req, res) => {
        try{
            let userFound = await User.findByPk(req.session.loggedUser.id)
            await userFound.destroy()
            req.session.loggedUser = null
            req.session.loggedIn = null
            req.session.destroy( () =>{
                res.redirect('/register')
            })    
        }catch(e){
            res.render('options', {
                error: e.message,
                user: req.session.loggedUser || null,
                title: 'Options',
                loggedIn: req.session.loggedIn || null
            })
        }
    },
    playGame: async (req, res) => {
        let user = await JSON.parse(req.body.user)
        const {whatToDo} = req.body
        const {score, roll, highscore, wins, tries} = user
        let newRoll = Math.random() * 10000
        let newScore = score
        let newHighscore = highscore
        let newWins = wins
        let newTries = tries
        let myCondition = whatToDo === 'higher' ? roll < newRoll : roll > newRoll
        if(myCondition){
            newScore++
            newWins++
            if(newScore > highscore){
                newHighscore = newScore
            }
        }else{
            newScore = 0
        }   
        newTries++
        try{
            let userFound = await User.upsert({id: user.id, username: user.username, roll: newRoll, score: newScore, tries: newTries, highscore: newHighscore, wins: newWins})
            console.log(userFound[0].dataValues)
            if(!userFound)throw new Error('User not found')
            req.session.loggedUser = userFound[0].dataValues
            res.redirect('/')
        }catch(e){
            res.render('index', {
                user: null,
                title: 'Home',
                error: e.message,
                loggedIn: false
            })
        }
    },
    logout: (req, res) => {
        req.session.loggedUser = null
        req.session.destroy( () =>{
            res.redirect('/')
        })
    }
}
module.exports = userControllers