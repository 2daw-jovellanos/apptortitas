var express = require('express'); // express
var bodyParser = require('body-parser'); // los parseadores de express

var controladores = require('./controladores'); // Los controladores de esta app.

var server = express();  // Crear el objeto express

// ************* Cargar middlewares
server.use(bodyParser.json()); // para parsear JSON en el body del request
// server.use(bodyParser.urlencoded({extended:true})); // para parsear parametros URLencoded (como si vinieran de un <form>).
server.use(express.static('public')); // para servir posible contenido estático.


// ************* indicar rutas a express

server.get('/libro/all', controladores.obtenerIds)
server.get('/libro/:id', controladores.obtenerLibro);
server.post('/libro', controladores.guardarLibro);
server.put('/libro/:id', controladores.modificarLibro);
server.delete('/libro/:id', controladores.borrarLibro);


// ************* Servir
server.listen(3000, function() {
    console.log("Servidor en marcha");
})


