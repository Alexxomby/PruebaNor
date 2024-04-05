const express = require('express')
const router = express.Router()

//la importacion de nuestros conreollers
const MetodosUser = require('../Controller_Login_user/authUser')


router.get('/', (req, res)=>{
    res.render('index', )
})

router.get('/Registro', (req, res)=>{
    res.render('registro_usuario', {alert:false})
})

router.get('/Login', (req, res)=>{
    res.render('login_usuario', {alert:false})
})

router.get('/Logindos', (req, res)=>{
    res.render('login2', {alert:false})
})

router.get('/Vista', (req, res)=>{
    res.render('vista_usuario', {alert:false})
})

router.get('/postRegistro', (req, res)=>{
    res.render('postr', {alert:false})
})

//vista_usuario
//router.get('/loginBien', MetodosUser.isAuthenticated, (req, res)=>{
   // res.render('vista_usuario',{ usuario: req.NombreG } )
//})

router.get('/loginBien', MetodosUser.isAuthenticadosi, (req, res)=>{
    res.render('vista_usuario', )
})


//los metodos que le estamos danto a los forms 
router.post('/register', MetodosUser.registrarUsuario)
router.post('/login', MetodosUser.IniciarSesionUsuario)

router.post('/login2', MetodosUser.IniciarSesionUsuario2 )



module.exports = router