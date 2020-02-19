/* Controladores. No estamos comprobando errores */

const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

// Crear el cliente del Mongo
var client = new MongoClient("mongodb://localhost:27017", { useUnifiedTopology: true });
// una variable para el manejador de la BD
var dbo;
// intento conectar
client.connect() // devuelve una promesa
    .then(       // que relleno con una función si la promesa se satisface
        () => {
            dbo = client.db("apilibros");
            console.log("Conectado a la bd apilibros");
        }
    )
    .catch(      // y otra si no se ha podido satisfacer
        (err) => {
            console.log("errrorrrr en mongo al conectar");
            console.log(err);
        }
    )


/** Controlador para obtener un libro */
exports.obtenerLibro = function (req, res) {
    let id = req.params.id;
    dbo.collection("libro").findOne({ _id: ObjectId(req.params.id) })
        .then((dbres) => { 
            res.json(dbres);
        })
        .catch((err) => { 
            res.status(400).end();
        })

    let libro = libros[id];
    res.json({id, ...libro}); 
}

/** Controlador para obtener todos los id de libros 
 * Envia un array con las ids */

exports.obtenerIds = function (req, res) {
    var ids = [];
    for (i in libros) {
        ids.push(i);
    }
    res.json(ids); 
}

/** Controlador para guardar un libro. Envia el libro guardado, añadiendo su id */
exports.guardarLibro = function(req, res) {
    let libro = req.body;
    let id = libros.length;
    libros.push(libro);
    res.json({
        id,
        ...libro  // el operador spread añade los atributos del objeto libro a este objeto
    });
};

/** Controlador para modificar un libro. No devuelve cuerpo */
exports.modificarLibro = function(req, res) {
    let libro = req.body;
    let id = req.params.id;
    delete libro.id; // borrar el id del objeto, si es que nos lo han enviado
    libros[id] = libro;
    res.end();
};

/** Controlador para borrar. No devuelve cuerpo */
exports.borrarLibro = function(req, res) {
    let id = req.params.id;
    libros[id]=null;
    res.end();
};
