
Vue.component('alumno',
    {
        data: function () {
            return {
                id: this.datos._id,
                anima: false, // indica si se anima el badge
                ...this.datos,
            }
        },
        props: {
            datos: Object
        },
        methods: {
            more() { // añadir una tortita
                this.tortitas++;
                this.anima = true;
                this.update("tortitas");
                setTimeout(() => { this.anima = false }, 2000);
            },
            update(field) { // enviar un update al api
                let alumno = {};
                switch (field) {
                    case 'tortitas':
                        alumno.tortitas = this.tortitas;
                        break;
                    case 'vegan':
                        alumno.vegan = this.vegan;
                        break;
                    case 'glutenfree':
                        alumno.glutenfree = this.glutenfree;
                        break;
                }
                fetch("/alumno/" + this.id, {
                    "method": "PUT",
                    "headers": {
                        "content-type": "application/json"
                    },
                    "body": JSON.stringify(alumno),
                })
                    .then(response => {
                        if (response.status >= 400) {
                            this.$emit("error", `Update: no status 200`)
                        }
                        console.log(`PUT de ${this.nombre} (${this.id})`);
                    })
                    .catch(err => { this.$emit("error", `Update: ${err}`) })

            }
        },
        template:
            `
<div class="border m-2 p-2 rounded">            
<h3>
   {{this.nombre}}
   <span class="badge badge-primary" :class="{bounceIn:this.anima}" >{{this.tortitas}} </span> 
   <button class="btn btn-secondary" v-on:click="more()">Más</button>
</h3>
    <label>
        <input type="checkbox" v-model="vegan" @change="update('vegan')"> vegan
    </label>
    <label class="ml-3">
        <input type="checkbox" v-model="glutenfree" @change="update('glutenfree')"> gluten free
    </label>

</div>`
    }
)

var vue = new Vue({
    el: "#app",
    data: {
        alumnos: [],
        nuevonombre: "", // el nombre de un alumno nuevo
        error: "", // el mensaje de error
    },
    created() {
        this.cargarTodo();
    },
    computed: {
        isNameInvalid() {
            return (_.findIndex(this.alumnos, { nombre: this.nuevonombre }) >= 0);
        }
    },
    methods: {
        annadirNombre() {
            if (this.isNameInvalid || !this.nuevonombre) {
                this.setError("Nombre no válido.");
                return;
            }
            console.log("POST de alumno nuevo");
            fetch("/alumno", {
                "method": "POST",
                "headers": {
                    "content-type": "application/json"
                },
                "body": JSON.stringify({
                    "nombre": this.nuevonombre
                })
            })
                .then(response => response.json())
                .then(response => { this.alumnos.push(response); this.alumnos = _.sortBy(this.alumnos, "nombre") }
                )
                .catch(err => { this.setError(`Añadiendo alumno: ${err}`) });
            this.nuevonombre = ""
        },
        borrarTodo() {
            console.log("DELETE de todo");
            fetch("/alumno",
                { "method": "DELETE" }
            )
                .then(response => {
                    if (response.status >= 400) {
                        this.setError("Status 400 en borrar todo");
                        return;
                    }
                    this.cargarTodo();
                })
                .catch(err => { this.setError(`borrando todos: ${err}`) });

        },
        cargarTodo() {
            console.log("GET de todos los alumnos");
            fetch("/alumno")
                .then((res) => { return res.json(); })
                .then((res) => { this.alumnos = _.sortBy(res, "nombre") })
                .catch((err) => { this.setError(`Fetch de todos los alumnos: ${err}`) })

        },
        setError(err) {
            this.error = err;
            setTimeout(() => {
                this.error = "";
            }, 5000);
        }
    }
});

