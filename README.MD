# App SPA de libros en stack MEVN

## node.js y los módulos.

El programa principal suele llamarse `index.js`, aunque no hay ninguna limitación al respecto.

El programa puede dividirse en módulos. Existen distintos sistemas de módulos. (El descrito aquí corresponde a CommnonJS, muy utilizado con ES5 para node.js)

Para definir un módulo: en otro fichero .js, lo que se quiera exportar del módulo se coloca como atributos de un objeto llamado `exports`.

Ej: `mimodulo.js`:

```js
var a = 3; // no se exporta;
exports.b = 20 // sí se exporta
exports.saludar = function() {console.log('hola');} // se exporta
```

Para usar este módulo en index.js:

```js
var modulo = require('./mimodulo');
console.log(modulo.b);
modulo.saludar();
```

## instalando dependencias.
* iniciamos el gestor de dependencias con `npm init`
* necesitamos express: `npm install express --save` instala express y lo guarda en _package.json_
* nos viene bien nodemon, que es un programa que reinicia node cada vez que se hacen cambios en los
  ficheros .js `npm install nodemon --save-dev --global`. Global hace que se instale para todos los proyectos de node, no solo para este. 

## Express
Cargamos el módulo de express, y los parseadores del body.
```js
var express = require('express'); // express
var bodyParser = require('body-parser'); // los parseadores de express
var server = express();  // Crear el objeto express
```

Express permite ejecutar _middlewares_, que son como filtros que permiten procesar la petición. En este caso, necesitamos ejecutar el middleware que parseará el body de la petición buscando _json_

```js
server.use(bodyParser.json());
```

Aunque no es necesario para este proyecto, se suelen usar a menudo los middlewares para parsear datos venidos de un &lt;form&gt; (en formato urlencode), y otro para servir ficheros estáticos, en este ejemplo en una carpeta llamada _public_.

```js
// server.use(bodyParser.urlencoded({extended:true}));
// server.use(express.static('public'));
```

Las rutas se definen con los métodos `get`, `post`, `put`... que tienen dos parámetros: el primero indica la ruta, y el segundo un callback que procesará la ruta si se produce.  
La ruta puede contener parámeotros, que se indican con dos puntos seguido de un identificador.
La retrollamada tendrá al menos dos parámetros: `req` y `res`, que representa a la petición y la respuesta, repectivamente.

```js
server.get('/info/:nombre, function(req, res) {
    server.send("Hola "+req.params.nombre);
})
```

### algunos métodos y funciones de req y res

* `req.params`: un array con los parámetros (slugs) de la url
* `req.query`: Los parámetros urlencodeados en la url (ej: ?nombre=paco)
* `req.body`: el cuerpo, parseado por el parseador de json o el de urlencode.

* `res.status(400)`: fija el código de respuesta
* `res.send("una cadena")`: envía la cadena a la respuesta
* `res.json(obj)`
* `res.set('Content-Type', 'text/plain')`: Fija un campo de cabecera.

* [Referencia completa aquí](https://expressjs.com/es/api.html)



## MongoDB

MongoDB es un sistema gestor de bases de datos de tipo clave/valor (como un Map de Java, o un array asociativo de PHP). 

Las claves son datos simples, como enteros o cadenas. Si no se proporciona una clave, MongoDB pone una de tipo [ObjectId](https://docs.mongodb.com/manual/reference/method/ObjectId/), que es un identificador único de 12 bytes. 

Los valores son documentos JSON, que representan a un objeto. MongoDB los almacena en un formato binario optimizado que ellos denominan BSON (Binary jSON). Esto permite manipularlos con rapidez y hacer queries con un rendimiento razonable.

### Uso en node

Instalamos el driver de mongodb

```js
npm install mongodb --save
```

Importamos el cliente del driver y la clase de los id de mongo.

```js
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
```

Conectarse y seleccionar una BD:  
* `client.connect()`  devuelve una promesa.  
* `client.db` devuelve un manejador de la base de datos, sobre el que se hacen las operaciones.  

```js
var client = new MongoClient("mongodb://localhost:27017", { useUnifiedTopology: true });
var dbo;
client.connect()
    .then(
        () => {
            dbo = client.db("apilibros");
            console.log("Conectado a la bd apilibros");
        }
    )
    .catch(
        (err) => {
            console.log("errrorrrr en mongo al conectar");
            console.log(err);
        }
    )
```

### API de la colección.

Las operaciones de datos se hacen sobre las colecciones.
[Documentación del API del driver](http://mongodb.github.io/node-mongodb-native/3.5/api/Collection.html)

### Create

Se utiliza el método `insertOne(doc, options, callback)⇒ Promise` sobre una colección, al que se le pasa el objeto a insertar.
Este método acepta una retrollamada y devuelve una promesa. Debe escogerse uno de los dos mecanismos para realizar una acción cuando haya sido satisfecha la operación.

Si este objeto tiene un atributo llamado `_id`, entonces se utiliza como clave, si no, MongoDB proporciona uno de tipo [ObjectID](https://docs.mongodb.com/manual/reference/method/ObjectId/)

```js
    let item = ... // Un objeto
    dbo.collection("libro").insertOne(item) // devuelve una  promesa
       .then((dbres)=>{
           // dbres.ops[0] contiene el objeto insertado
        })
       .catch((err)=>{  })
```

El atributo `ops` de `dbres`, que es la respuesta del sgbd, contiene los objetos insertados con su id incluída. Así pues, `dbres.ops[0]` contiene el objeto recién insertado con su id.

[Documentación](http://mongodb.github.io/node-mongodb-native/3.5/api/Collection.html#insertOne)

### Retrieve

Se utiliza el método `find` para obtener una colección de objetos, o `findOne` de la misma manera, pero sólo obtendrá el primer objeto que satisfaga la petición.

`findOne(query, options, callback) ⇒ Promise`

La query es un objeto en el que se indica lo que se quiere buscar. Si son datos simples, los campos contienen los valores a buscar.  
Ej `{_id: "3"}`, `{autor:"Stephen King"}`  
Si el Id es un ObjectId se convierte de esta manera.
`{ _id: ObjectId(req.params.id) }`

Si son datos complejos, mongo dispone de un sistema de interrogación.

El segundo parámetro indica opciones, como el orden o los atributos a devolver. Por ejemplo, el conjunto de atributos a devolver se denomina projection, y se especifica con el nombre de los atributos y un 1 de valor para aquellos que se quieren obtener
Ej `{projection: {titulo:1, autor:1}}` -> Solo título y autor

```js
//obtener un libro por id
dbo.collection("libro").findOne({ _id: ObjectId(req.params.id) })
        .then((dbres) => { })
        .catch((err) => { })
```

`find(query, options, callback) ⇒ Promise`
Find funciona de manera similar, pero su promesa o retrollada pasará un cursor que permitirá acceder a un conjunto de objetos.

Este cursor puede ser utilizado para obtener los datos de manera iterativa, o con el metodo `toArray()` se pueden obtener todos los datos en un array.

```js
    // todos los libros - solo el _id
    dbo.collection("libro").find({}, { projection: { _id: 1 } }).toArray()
        .then((dbres) => { }))
        .catch((err) => { })
```

### Update

`updateOne(filter, update, options, callback) ⇒ Promise`  
`updateMany(filter, update, options, callback) ⇒ Promise`  

El primer parámetro selecciona los objetos a modificar. 
El segundo indica los valores nuevos.
Ej: `updateMany({autor:'Haruki Murakami'}, {$set: {leido:true}})`
 Pone a true el atributo _leido_ de los objetos cuyo campo _autor_ sea 'Haruki Murakami' 

```
    var myquery = { _id: ObjectId(req.params.id) };
    var newvalues = { $set: req.body };
    dbo.collection("libro").updateOne(myquery, newvalues)
        .then((dbres) => res.end())
        .catch((err) => { })

```

### Delete

Consulta la documentación de [los métodos deleteOne y deleteMany](http://mongodb.github.io/node-mongodb-native/3.5/api/Collection.html).

