var express = require('express'); // express
var bodyParser = require('body-parser'); // los parseadores de express
var controladores = require("./controladores");
var server = express();  // Crear el objeto express

// ************* Cargar middlewares
server.use(bodyParser.json()); // para parsear JSON en el body del request
// server.use(bodyParser.urlencoded({extended:true})); // para parsear parametros URLencoded (como si vinieran de un <form>).
server.use(express.static('public')); // para servir posible contenido estático.


// ************* indicar rutas a express


server.get('/alumno', controladores.obtenerTodos)
//server.get('/alumno/:id', controladores.obtenerAlumno);
server.delete('/alumno', controladores.borrarTodo)
server.post('/alumno', controladores.guardarAlumno);
server.put('/alumno/:id', controladores.modificarAlumno);



// ************* Servir
server.listen(3300, function() {
    console.log("Servidor en marcha");
})


