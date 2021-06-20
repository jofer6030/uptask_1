const Sequelize = require('sequelize');
const db = require('../config/db');
const Proyectos = require('./Proyectos');
const bcrypt = require('bcrypt-nodejs');

const Usuarios = db.define('usuarios', {
    id:{
        type: Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    email:{
        type: Sequelize.STRING(60),
        allowNull:false, //este campo no puede ir vacio
        validate:{
            isEmail:{
                msg:'Agrega un Correo Valido'
            },
            notEmpty:{
                msg: 'El email no puede ir vacío'
            }
        },
        unique:{
            args:true,
            msg:'Usuario Ya Registrado'
        }
    },
    password:{
        type: Sequelize.STRING(60),
        allowNull:false, //este campo no puede ir vacio
        validate:{
            notEmpty:{
                msg: 'El password no puede ir vacío'
            }
        }
    },
    activo:{
        type: Sequelize.INTEGER,
        defaultValue: 0, 
    },
    token: Sequelize.STRING,
    expiracion:Sequelize.DATE
},{
    hooks: {
        beforeCreate:(usuario) =>{
            usuario.password = bcrypt.hashSync(usuario.password,bcrypt.genSaltSync(10));
        }
    }
});

//Metodos personalizados-->compara en password ingresado por el de la BD
Usuarios.prototype.verificarPassword = function(password){
    return bcrypt.compareSync(password,this.password)//El this.password hace referencia al passqord alamacenado en la BD
}

Usuarios.hasMany(Proyectos); //significa q un usuario puede crear varios proyectos(1:n)--> se crea fk    


module.exports = Usuarios;