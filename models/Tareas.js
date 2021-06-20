const Sequelize = require('sequelize');
const db = require('../config/db');
const Proyectos = require('./Proyectos');

const Tareas = db.define('tareas', {
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    tarea: Sequelize.STRING(100),
    estado: Sequelize.INTEGER(1)
});

Tareas.belongsTo(Proyectos); //una tarea solo puede pertenecer a un proyecto relacion de 1 a 1 :generar llave foranea fk auromaticamente con el ORM

module.exports = Tareas;