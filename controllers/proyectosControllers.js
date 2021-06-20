const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

exports.proyectosHome = async(req,res) => {
    // console.log(res.locals.usuario);
    const usuarioId = res.locals.usuario.id;

    const proyectos = await Proyectos.findAll({where:{usuarioId}});

    res.render('index',{
        nombrePagina: 'Proyectos',
        proyectos 
    });
}

exports.formularioProyectos = async(req,res) => {
    const usuarioId = res.locals.usuario.id;

    const proyectos = await Proyectos.findAll({where:{usuarioId}});
    res.render('nuevoProyecto',{
        nombrePagina: 'Nuevo Proyecto',
        proyectos
    })
}

exports.nuevoProyecto = async (req,res) => {
    const usuarioId = res.locals.usuario.id;

    const proyectos = await Proyectos.findAll({where:{usuarioId}});
    //Enviar a la consola lo que el usuario escriba
    // console.log(req.body) -->Para acceder a los datos que se escribe por la consola de la terminal

    //Validar que tengamos algo en el input
    const {nombre} = req.body;

    let errores =[];

    if(!nombre) {
        errores.push({'texto':'Agrega un nombre al Proyecto'});
    }

    //Si hay errores 
    if(errores.length > 0) {
        res.render('nuevoProyecto',{
            nombrePagina:'Nuevo Proyecto',
            errores,
            proyectos
        })
    }else {
        //NO hay errores 
        //Insertar a la BD
        const usuarioId = res.locals.usuario.id;
        await Proyectos.create({ nombre,usuarioId });/*{nombre:nombre} el primero es el nombre de la columna de la BD*/
        res.redirect('/');
    }
}

exports.proyectoPorUrl = async(req, res,next) => {
    const usuarioId = res.locals.usuario.id;

    const proyectosPromise =  Proyectos.findAll({where:{usuarioId}});

    const proyectoPromise =  Proyectos.findOne({
        where: {
            url: req.params.url,
            usuarioId
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise,proyectoPromise]);

    //Consultar Tareas del proyecto actual

    const tareas = await Tareas.findAll({
        where: {
            proyectoId: proyecto.id
        },
        // include: [
        //     {model: Proyectos}
        // ]
    });


    if (!proyecto) return next();

    //render a la vista
    res.render('tareas', {
        nombrePagina: 'Tareas del Proyecto',
        proyecto,
        proyectos,
        tareas
    })
}

exports.formularioEditar = async(req, res) => {
    const usuarioId = res.locals.usuario.id;

    const proyectosPromise =  Proyectos.findAll({where:{usuarioId}});

    const proyectoPromise =  Proyectos.findOne({
        where: {
            id: req.params.id,
            usuarioId
        }
    });
    //Es mejor ponerlo en un promise ya que cada consulta no depende de la otra en este caso
    const [proyectos, proyecto] = await Promise.all([proyectosPromise,proyectoPromise]);

    //render a la vista
    res.render('nuevoProyecto', {
        nombrePagina: 'Editar Proyecto',
        proyectos,
        proyecto
    })
}

exports.actualizarProyecto = async (req,res) => {
    const usuarioId = res.locals.usuario.id;

    const proyectos=  Proyectos.findAll({where:{usuarioId}});
    //Enviar a la consola lo que el usuario escriba
    // console.log(req.body) -->Para acceder a los datos que se escribe por la consola de la terminal

    //Validar que tengamos algo en el input
    const {nombre} = req.body;

    let errores =[];

    if(!nombre) {
        errores.push({'texto':'Agrega un nombre al Proyecto'});
    }

    //Si hay errores 
    if(errores.length > 0) {
        res.render('nuevoProyecto',{
            nombrePagina:'Nuevo Proyecto',
            errores,
            proyectos
        })
    }else {
        //NO hay errores 
        //Insertar a la BD
        await Proyectos.update(
            { nombre: nombre },
            { where: {id: req.params.id}}
            );
        res.redirect('/');
    }
}

exports.eliminarProyecto = async (req, res, next) => {
    // console.log(req.query);
    const {urlProyecto} = req.query

    const resultado = await Proyectos.destroy({where: {url: urlProyecto}});

    if(!resultado) {
        return next();
    }

    res.status(200).send('Proyecto Eliminado Correctamente')
}