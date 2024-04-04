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

router.get('/Vista', (req, res)=>{
    res.render('vista_usuario', {alert:false})
})

router.get('/postRegistro', (req, res)=>{
    res.render('postr', {alert:false})
})

//vista_usuario
router.get('/loginBien', (req, res)=>{
    res.render('vista_usuario', {alert:false})
})



//los metodos que le estamos danto a los forms 
router.post('/register', MetodosUser.registrarUsuario)
router.post('/login', MetodosUser.IniciarSesionUsuario )


module.exports = router