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
        .then((dbres) => { res.json(dbres); })
        .catch((err) => { res.status(400).end(); })
}

/** Controlador para obtener todos los id de libros 
 * Envia un array con las ids */

exports.obtenerIds = function (req, res) {
    dbo.collection("libro").find({}, { projection: { _id: 1 } }).toArray()
        .then((dbres) => { res.json(dbres.map((obj) => obj._id)) }) // mapea resultado a array solo de _ids
        .catch((err) => {
            console.log(err);
            res.status(400).end()
        })
}

/** Controlador para guardar un libro. Envia el libro guardado, añadiendo su id */
exports.guardarLibro = function (req, res) {
    let item = req.body;
    dbo.collection("libro").insertOne(item)
        .then((dbres) => { res.json(dbres.ops[0]) })
        .catch((err) => {
            console.log(err);
            res.status(400).end()
        })
};

/** Controlador para modificar un libro. No devuelve cuerpo */
exports.modificarLibro = function (req, res) {
    var myquery = { _id: ObjectId(req.params.id) };
    var newvalues = { $set: req.body };
    dbo.collection("libro").updateOne(myquery, newvalues)
        .then((dbres) => res.end())
        .catch((err) => {
            console.log(err);
            res.status(400).end()
        })
};

/** Controlador para borrar. No devuelve cuerpo */
exports.borrarLibro = function (req, res) {
    console.log("por hacer");
};
