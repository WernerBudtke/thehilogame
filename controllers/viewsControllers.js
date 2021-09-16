const User = require("../models/User")

const viewsControllers = {
    home: (req, res)  => {
        let loggedUser = null
        if(req.session.loggedUser){
            loggedUser=req.session.loggedUser  
        }
        res.render('index', {
            title: 'Home',
            error: null,
            user: loggedUser,
            loggedIn: req.session.loggedIn
        })
    },
    register: (req, res)  => {
        if(req.session.loggedIn){
            res.redirect('/')
        }else{
            res.render('register', {
                title: 'Register',
                error: null,
                user: null,
                loggedIn: null
            })
        }
    },
    login: (req, res) => {
        if(req.session.loggedIn){
            res.redirect('/')
        }else{
            res.render('login', {
                title: 'Log In',
                error: null,
                user: null,
                loggedIn: null
            })
        }
    },
    highscore: async (req, res) => {
        let highscores = await User.find().sort({highscore: -1}).limit(10)
        let loggedUser = null
        if(req.session.loggedUser){
            loggedUser=req.session.loggedUser  
        }
        res.render('highscores',{
            title: 'Highscores',
            error: null,
            highscores,
            user:loggedUser,
            loggedIn: req.session.loggedIn
        })
    },
    options: (req, res) => {
        if(!req.session.loggedIn){
            res.redirect('/login')
        }else{
            let loggedUser = null
            if(req.session.loggedUser){
                loggedUser=req.session.loggedUser  
            }
            res.render('options',{
                title: 'Options',
                error: null,
                user:loggedUser,
                loggedIn: req.session.loggedIn
            })
        }
    }
}
module.exports = viewsControllers