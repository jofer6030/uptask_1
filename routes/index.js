const express = require('express');
const router = express.Router();

//importar express validator
const {body} = require('express-validator');


//importar el controlador
const proyectosController = require('../controllers/proyectosControllers');
const tareasController = require('../controllers/tareasControllers');
const usuariosController = require('../controllers/usuariosControllers');
const authController = require('../controllers/authControllers');

module.exports = function () {

    //ruta para el home
    router.get('/', 
        authController.usuarioAutenticado,
        proyectosController.proyectosHome
    );
    router.get('/nuevo-proyecto',
        authController.usuarioAutenticado,
        proyectosController.formularioProyectos
    );
    router.post('/nuevo-proyecto',/*body(nombre del campo)-->en este caso el campo del form esta con name="nombre" */
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),/*not().empty()-->pregunta si no esta vacio trim()-->borra los espacios*/
        proyectosController.nuevoProyecto             /*escape()-->sanitiza caracteres no permitidos (<,>,/,y de mas cosas) */
    );
    //Listar Proyecto
    router.get('/proyectos/:url',
        authController.usuarioAutenticado,
        proyectosController.proyectoPorUrl 
    );

    //Actualizar el Proyecto
    router.get('/proyecto/editar/:id',
        authController.usuarioAutenticado,
        proyectosController.formularioEditar
    );
    router.post('/nuevo-proyecto/:id',
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.actualizarProyecto            
    );

    //Eliminar Proyecto
    router.delete('/proyectos/:url',
        authController.usuarioAutenticado,
        proyectosController.eliminarProyecto
    );

    //Tareas
    router.post('/proyectos/:url',
        authController.usuarioAutenticado,
        tareasController.agregarTarea
    );
    
    //Actualizar Tareas
    router.patch('/tareas/:id',
        authController.usuarioAutenticado,
        tareasController.cambiarEstadoTarea
    );

    //Eliminar Tarea
    router.delete('/tareas/:id',
        authController.usuarioAutenticado,
        tareasController.eliminarTarea  
    );

    //Crear nueva cuenta
    router.get('/crear-cuenta',usuariosController.formCrearCuenta);
    router.post('/crear-cuenta',usuariosController.crearCuenta);
    router.get('/confirmar/:correo',usuariosController.confirmarCuenta);

    //Iniciar Sesion
    router.get('/iniciar-sesion',usuariosController.formIniciarSesion);
    router.post('/iniciar-sesion',authController.autenticarUsuario);

    //cerrar sesion
    router.get('/cerrar-sesion',authController.cerrarSesion);

    //reestablecer contraseña
    router.get('/reestablecer',usuariosController.formRestablecerPassword);
    router.post('/reestablecer',authController.enviarToken);
    router.get('/reestablecer/:token',authController.validarToken);
    router.post('/reestablecer/:token',authController.actualizarPassword);

    return router;
    
}

