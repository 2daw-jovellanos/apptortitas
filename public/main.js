Vue.component('libro',
    {
        data: function() {
            return {
                titulo: "El titulo",
                autor: "El autor",
                leido: false,
            }
        },
        props: {
            _id: String,
        },
        created: function() {
            console.log("fetching libro /libro/"+this._id)
            fetch("/libro/"+this._id)
                .then((res)=>res.json())
                .then((res)=>{
                    this.titulo=res.titulo;
                    this.autor=res.autor;
                    this.leido=res.leido;
                })
        },
        methods: {
            update: function() {
                let libro = {
                    titulo: this.titulo,
                    autor: this.autor,
                    leido: this.leido
                };
                fetch("/libro/"+this._id, {
                    "method": "PUT",
                    "headers": {
                      "content-type": "application/json"
                    },
                    "body": JSON.stringify(libro),
                  })
                  .then(response => {
                    console.log("Updated "+ this._id);
                  })

            }
        },
        template:
`<div class="card mb-1">
  <div class="card-header">
    {{titulo}}
  </div>
  <div class="card-body" :class="{'bg-warning':leido}">
    <h5 class="card-title">{{autor}}</h5>
    <p class="card-text">id: {{_id}}</p>
    <label>
        <input type="checkbox" v-model="leido" @change="update"> Leído;
    </label>
  </div>
</div>`
    }
)

var vue = new Vue({
    el: "#app",
    data: {
        idsLibros: [],
    },
    created: function () {
        console.log("Fetching todos los libros");
        fetch("/libro/all")
            .then((res) => { return res.json(); })
            .then((res) => { this.idsLibros = res });

    },
});

