const express = require('express')
const router = express.Router()


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



module.exports = router