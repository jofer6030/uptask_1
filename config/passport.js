const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


//Referencia al Modelo donde vamos a auntenticar
const Usuarios = require('../models/Usuarios');

//LocalStrategy - login con credenciales propias (usuario y password)
passport.use(
    new LocalStrategy(
        //por default passport espera un usuario y password
        {
            usernameField:'email',
            passwordField:'password',
        },
        async (email,password,done) => { //se ingresa el email y password en el login
            try {
                const usuario = await Usuarios.findOne({
                    where: {
                        email,
                        activo:1
                    }
                })
                //El usuario existe, password incorrecto
                if(!usuario.verificarPassword(password)){
                    return done(null,false,{
                        message:'Password incorrecto'
                    })
                }

                //el email existe, y el password correcto
                return done(null,usuario);

            } catch (error) {
                //Ese usuario no existe
                return done(null,false,{
                    message:'Esa cuenta no existe'
                })
            }
        }
    )
);

//serializar el usuario-->como el usuario retorna en forma de objeto serializar es acceder a los valores 
passport.serializeUser((usuario,callback) => {
    callback(null, usuario)
});

//deserializar al usuario-->lo contrario
passport.deserializeUser((usuario,callback) => {
    callback(null, usuario)
});

//exportar
module.exports = passport;

