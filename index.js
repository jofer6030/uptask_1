const express = require('express'); // de Express
const path = require('path'); // de Node mismo
const routes = require('./routes');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');  

//importar las variables
require('dotenv').config({path:'variables.env'})//no es necesario el ../ para salir de la carpeta


//helpers con algunas funciones
const helpers = require('./helpers');   

//Crear la conexion a la DB
const db = require('./config/db');

//Importar el modelo
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

db.sync()/* permite crear la tabla con su respectiva estructura declarada en el modelo */
    .then(() => console.log('Conectado al Servidor'))
    .catch(err => console.log(err));
//Crear una app de express
const app = express();

//Donde cargar los archivos estaticos
app.use(express.static('public'));

//Habilitar pug
app.set('view engine','pug');

//Habilitar para leer datos del formulario
app.use(express.urlencoded({extended:true}));

//Añadir las carpetas de las vistas
app.set('views', path.join(__dirname,'./views'));

//Agregar flash messages
app.use(flash());

app.use(cookieParser());

//sessiones nos permiten navegar en distintas paginas sin volvernos a auntenticar
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());//arrancar una instancia de passport
app.use(passport.session());

//Pasar var_dump a la aplicacion
app.use((req,res,next)=> {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null; //datos del inicio de session del usuario
    next(); /*Sirve para que siga a la siguiente funcion */
})


app.use('/',routes());

//Servidor y puerto
const host = process.env.HOST || '0.0.0.0'; /*Heroku asiugnara un host automatico para ello el default 0.0.0.0 */
const port = process.env.PORT || 3000;/*Al revez heroku pondra un puerto pero sino hay tomara el 3000 */

app.listen(port,host,() =>{
    console.log('El servidor esta funcionando');
});