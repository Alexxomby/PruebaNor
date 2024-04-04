const conexion = require('../Database/db');
const { promisify } = require('util');

// Convierte la función query en una función que devuelve una promesa
const queryAsync = promisify(conexion.query).bind(conexion);

//procedimiento para registrarnos
exports.registrarUsuario = async (req, res)=>{    
    try {
        const name = req.body.name;
        const user = req.body.user;
        const pass = req.body.pass;
        const appat = req.body.appat; 
        const apmat = req.body.apmat;
         
        // Insertar los datos de acceso
        await queryAsync('INSERT INTO datosa (CorreoA, PassA) VALUES (?, ?)', [user, pass]);

        // Obtener el ID generado automáticamente
        const resultsAcceso = await queryAsync('SELECT LAST_INSERT_ID() AS idAcceso');

        // El ID generado automáticamente
        const idAcceso = resultsAcceso[0].idAcceso;
        
        // Insertar los datos generales utilizando el ID obtenido anteriormente
        await queryAsync('INSERT INTO datosg (NombreG, ApellidoP, ApellidoM, idDatosA) VALUES (?, ?, ?, ?)', [name, appat, apmat, idAcceso]);
        
        res.redirect('/postRegistro');
    } catch (error) {   
        console.error(error);
        res.status(500).json({ error: 'Hubo un error al registrar el usuario' });
    }        
}


exports.IniciarSesionUsuario = async (req, res) => {
    try {
        const user1 = req.body.user
        const pass1 = req.body.pass

        // Consultar el usuario y la contraseña en la base de datos
        const results = await queryAsync('SELECT idDatosA   , idDatosA FROM datosa WHERE CorreoA = ? AND PassA = ?', [user1, pass1]);


        if (results.length === 0) {
            // Si no se encuentra un usuario con las credenciales proporcionadas, retornar un mensaje de error
            return res.render('login_usuario', {
                alert: true,
                alertTitle: "Error",
                alertMessage: "Usuario y/o contraseña incorrectos",
                alertIcon: 'error',
                showConfirmButton: true,
                timer: 1000,
                ruta: 'Login'
            });
        }


          // Obtener el ID de usuario y el ID de datos de acceso
          const userId = results[0].id;
        const datosAccesoId = results[0].idDatosA;
        console.log(datosAccesoId)
        res.render('Login', {
            alert: true,
            alertTitle: "Conexión exitosa",
            alertMessage: "¡LOGIN CORRECTO!",
            alertIcon:'success',
            showConfirmButton: false,
            timer: 800,
            ruta: 'loginBien'
       })

    } catch (error) {
        console.log(error)
    }
}

//https://chat.openai.com/share/016ea8e8-d7f7-4a18-9c0a-5f163dbfc1fa

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