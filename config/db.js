const  Sequelize  = require('sequelize');
//importar las variables
require('dotenv').config({path:'variables.env'})//no es necesario el ../ para salir de la carpeta

const db = new Sequelize(
  process.env.BD_NOMBRE,
  process.env.BD_USER ,
  process.env.BD_PASS,
  {
    host: process.env.BD_HOST,
    dialect: 'mysql',
    port: process.env.BD_PORT,
    operatorsAliases:0,
    define: {
        timestamps: false 
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000 
    } 
  }
);

module.exports = db;