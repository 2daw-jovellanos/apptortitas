/* Controladores. No estamos comprobando errores */

/** Esto hace de almacén de datos mientras no tengamos una BD 
 *  Se borra cada vez que se reinicia el servidor */
var libros = [];

/** Controlador para obtener un libro */
exports.obtenerLibro = function (req, res) {
    let id = req.params.id;
    let libro = libros[id];
    res.json({id,...libro}); 
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
