const conexion = require('../Database/db')
const {promisify} = require('util')

//procedimiento para registrarnos
exports.registrarUsuario = async (req, res)=>{    
    try {
        const name = req.body.name
        const user = req.body.user
        const pass = req.body.pass
        //mi teoria
        conexion.query('INSERT INTO users SET ?', {NombreG:user, ApellidoG: name, pass:passHash}, (error, results)=>{
            if(error){console.log(error)}
        })
        conexion.query('INSERT INTO users SET ?', {NombreG:user, ApellidoG: name, pass:passHash}, (error, results)=>{
            if(error){console.log(error)}
            res.redirect('/')
        })
    } catch (error) {   
        console.log(error)
    }       
}

exports.IniciarSesionUsuario = async (req, res)=>{
    try {
        const user1 = req.body.user
        const pass1 = req.body.pass        

        if(!user1 || !pass1 ){
            res.render('login',{
                alert:true,
                alertTitle: "Advertencia",
                alertMessage: "Ingrese un usuario y password",
                alertIcon:'info',
                showConfirmButton: true,
                timer: false,
                ruta: 'login'
            })
        }else{
            conexion.query('SELECT * FROM users WHERE user = ?', [user1], async (error, infoe)=>{
                if( infoe.length == 0 || ! (await bcryptjs.compare(pass1, infoe[0].pass)) ){
                    res.render('login', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "Usuario y/o Password incorrectas",
                        alertIcon:'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'login'    
                    })
                }else{
                    //inicio de sesión OK
                    const id = infoe[0].id
                    const token = jwt.sign({id:id}, process.env.JWT_SECRETO, {
                        expiresIn: process.env.JWT_TIEMPO_EXPIRA
                    })
                    //generamos el token SIN fecha de expiracion
                   //const token = jwt.sign({id: id}, process.env.JWT_SECRETO)
                   console.log("TOKEN: "+token+" para el USUARIO : "+user1)

                   const cookiesOptions = {
                        expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                        httpOnly: true
                   }
                   res.cookie('jwt', token, cookiesOptions)
                   res.render('login', {
                        alert: true,
                        alertTitle: "Conexión exitosa",
                        alertMessage: "¡LOGIN CORRECTO!",
                        alertIcon:'success',
                        showConfirmButton: false,
                        timer: 800,
                        ruta: ''
                   })
                }
            })
        }
    } catch (error) {
        console.log(error)
    }
}

exports.isAuthenticated = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO);
            conexion.query('SELECT user FROM users WHERE id = ?', [decodificada.id], (error, infoe) => {
                if (error) {
                    console.log(error);
                    return next();
                }
                if (infoe && infoe.length > 0) {
                    req.user = infoe[0].user
                }
                return next();
            });
        } catch (error) {
            console.log(error);
            return next();
        }
    } else {
        res.redirect('/login')
    }
}


exports.logout = (req, res)=>{
    res.clearCookie('jwt')   
    return res.redirect('/')
}