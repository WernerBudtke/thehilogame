const User = require('../models/User')
const bcryptjs = require('bcryptjs')
const userControllers = {
    register: async (req, res)  => {
        const {username, password} = req.body
        let hashedPass = bcryptjs.hashSync(password)
        let newUser = new User({
            username,
            password: hashedPass
        })
        try{
            await newUser.save()
            res.redirect('/login')
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
            let userFound = await User.findOne({username: username})
            if(!userFound)throw new Error(errMsg)
            if(!bcryptjs.compareSync(password, userFound.password))throw new Error(errMsg)
            userFound.password = null
            req.session.loggedUser = userFound
            req.session.loggedIn = true
            res.render('index', {
                user: userFound,
                title: 'Home',
                error: null,
                loggedIn: true
            })
        }catch(e){
            res.render('login', {
                title: 'Log In',
                error: e.message,
                user: null,
                loggedIn: false
            })
        }
        
    },
    removeUser: async (req, res) => {
        try{
            await User.findOneAndDelete({_id: req.params.user})
            req.session.loggedUser = null
            req.session.loggedIn = null
            res.redirect('/register')
        }catch(e){
            res.render('options', {
                error: e.message,
                user: req.session.loggedUser,
                title: 'Options',
                loggedIn: req.session.loggedIn
            })
        }
    },
    playGame: async (req, res) => {
        let user = await JSON.parse(req.body.user)
        const {whatToDo} = req.body
        const {username, score, roll, highscore, wins, tries} = user
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
            let userFound = await User.findOneAndUpdate({username: username}, {roll: newRoll, score: newScore, tries: newTries, highscore: newHighscore, wins: newWins}, {new:true})
            if(!userFound)throw new Error('User not found')
            userFound.password = null
            req.session.loggedUser = userFound
            res.render('index', {
                user: userFound,
                title: 'Home',
                error: null,
                loggedIn : true
            })
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