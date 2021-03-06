const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handlers/email')



exports.autenticarUsuario = passport.authenticate('local',{
    successRedirect: '/',//Si el login es correcto se redirige al home
    failureRedirect: '/iniciar-sesion', // Si el login es incorrecto a la misma pagina 
    failureFlash:true,//para acceder a los mensajes de error por flash
    badRequestMessage: 'Ambos campos son Obligatorios'
});

//Funcion para revisar si el usuario esta logeado o no
exports.usuarioAutenticado = (req,res,next)=> {

    //si el usuario esta autenticado, adelante
    if(req.isAuthenticated()){
        return next();
    }

    //sino esta autenticado, redirigir al formulario 
    return res.redirect('/iniciar-sesion');
}

//Funcion para cerrar sesion
exports.cerrarSesion = (req, res) => {
    req.session.destroy(()=>{
        res.redirect('/iniciar-sesion');//al cerrar sesion nos lleva
    })
}

//genera un token si el usuario es valido
exports.enviarToken = async(req, res) => {
    //verificar que el email exista
    const {email} = req.body
    const usuario = await Usuarios.findOne({where: {email}});

    //Si no existe el usuario
    if(!usuario){
        req.flash('error','No existe esa cuenta')
        res.redirect('/reestablecer')
    }

    //usuario existe
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000;

    //guardarlos en la BD
    await usuario.save();

    //url de reset
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;
    
    //Envia el correo con el token

    await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset',
        resetUrl,
        archivo:'reestablecer-password'
    });
    req.flash('correcto','Se envio un mensaje a tu correo');
    res.redirect('/iniciar-sesion');
}

exports.validarToken = async(req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token
        }
    });
    //si no encuentra al usuario
    if(!usuario) {
        req.flash('error','No V??lido');
        res.redirect('/reestablecer');
    }

    //Formulario para generar el password
    res.render('resetPassword',{
        nombrePagina:'Reestablecer Contrase??a'
    })
    console.log(usuario)
}

//Cambia el password por uno nuevo
exports.actualizarPassword = async(req, res) => {
    //verifica el token valido pero tbn la fecha de expiracion
    const usuario = await Usuarios.findOne({
        where:{
            token : req.params.token,
            expiracion: {
                [Op.gte] : Date.now()
            }
        }
    });

    //verificamos si el usuario existe
    if(!usuario){
        req.flash('error','No v??lido');
        res.redirect('/reestablecer');
    }

    //hashear el password 
    usuario.password = bcrypt.hashSync(req.body.password,bcrypt.genSaltSync(10));
    usuario.token = null;
    usuario.expiracion = null;

    //guardamos el nuevo password
    await usuario.save();

    req.flash('correcto','Tu password se ha modificado correctamente')
    res.redirect('/iniciar-sesion');
}




