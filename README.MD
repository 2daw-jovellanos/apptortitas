# App SPA de libros en stack MEVN

## node.js y los módulos.

El programa principal suele llamarse `index.js`, aunque no hay ninguna limitación al respecto.

El programa puede dividirse en módulos. Existen distintos sistemas de módulos. El descrito aquí corresponde a ES5 para node.js:

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

> Existen otros sistemas de módulos.

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

