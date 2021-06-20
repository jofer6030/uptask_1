const Sequelize = require('sequelize');
const db = require('../config/db');
const slug = require('slug');/*Crear url ejm: Tienda Virtual--->Tienda-Virtual */
const shortid = require('shortid');/*Genrar a la url un id unico (c5Ao5?4>) */


const Proyectos = db.define('proyectos', {
    id : {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre : Sequelize.STRING(100), /* nombre : {type:Sequelize.STRING} */
    url: Sequelize.STRING(100)       /* url : {type:Sequelize.STRING} */
},{
    hooks: {
        beforeCreate(proyecto) {
            const url = slug(proyecto.nombre).toLowerCase();

            proyecto.url = `${url}-${shortid.generate()}`;
        }
    }
});

module.exports = Proyectos;