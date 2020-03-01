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
            dbo = client.db("apitortitas");
            console.log("Conectado a la bd apitortitas");
        }
    )
    .catch(      // y otra si no se ha podido satisfacer
        (err) => {
            console.log("errrorrrr en mongo al conectar");
            console.log(err);
        }
    )


/** Controlador para obtener un alumno */
exports.obtenerAlumno = function (req, res) {
    let id = req.params.id;
    dbo.collection("alumno").findOne({ _id: ObjectId(req.params.id) })
        .then((dbres) => { res.json(dbres); })
        .catch((err) => { res.status(400).end(); })
}

/** Controlador para obtener todos los id de alumnos
 * Envia un array con las ids */

exports.obtenerTodos = function (req, res) {
    dbo.collection("alumno").find().toArray()
        .then((dbres) => { res.json(dbres) }) // mapea resultado a array solo de _ids
        .catch((err) => {
            console.log(err);
            res.status(400).end()
        })
}

exports.borrarTodo = function (req, res) {
    dbo.collection("alumno").drop()
        .then((dbres) => { res.end() }) 
        .catch((err) => {
            console.log(err);
            res.status(400).end()
        })
}


/** Controlador para guardar un alumno. Envia el alumno guardado, añadiendo su id */
exports.guardarAlumno = function (req, res) {
    let item = {
        nombre: req.body.nombre,
        tortitas: 1,
        vegan: false,
        glutenfree: false
    }
    dbo.collection("alumno").insertOne(item)
        .then((dbres) => { res.json(dbres.ops[0]) })
        .catch((err) => {
            console.log(err);
            res.status(400).end()
        })
};

/** Controlador para modificar un alumno. No devuelve cuerpo */
exports.modificarAlumno = function (req, res) {
    var myquery = { _id: ObjectId(req.params.id) };
    var newvalues = { $set: req.body };
    dbo.collection("alumno").updateOne(myquery, newvalues)
        .then((dbres) => res.end())
        .catch((err) => {
            console.log(err);
            res.status(400).end()
        })
};


