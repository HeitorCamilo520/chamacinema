let prefs = [];
const genres= [
    {"id": 28,
      "name": "Ação"
    },
    {"id": 12,
      "name": "Aventura"
    },
    {"id": 16,
      "name": "Animação"
    },
    {"id": 35,
      "name": "Comédia"
    },
    {"id": 80,
      "name": "Crime"
    },
    {"id": 99,
      "name": "Documentário"
    },
    { "id": 18,
      "name": "Drama"
    },
    { "id": 10751,
      "name": "Família"
    },
    { "id": 14,
      "name": "Fantasia"
    },
    { "id": 36,
      "name": "História"
    },
    { "id": 27,
      "name": "Terror"
    },
    { "id": 10402,
      "name": "Música"
    },
    { "id": 9648,
      "name": "Mistério"
    },
    { "id": 10749,
      "name": "Romance"
    },
    { "id": 878,
      "name": "Ficção científica"
    },
    { "id": 10770,
      "name": "Experimental"
    },
    { "id": 53,
      "name": "Horror"
    },
    { "id": 10752,
      "name": "Guerra"
    },
    { "id": 37,
      "name": "Faroeste"
    }
  ]

function Preferir(genero){
    if (!$(genero).hasClass("selected")){
        for (let i = 0; i < genres.length; i++) {
            if ($(genero).text() == genres[i].name){
                prefs.push(genres[i].id);
                $(genero).toggleClass("selected");
            }         
        }
    }
    else if ($(genero).hasClass("selected")){
        for (let i = 0; i < prefs.length; i++) {
            if(prefs[i] == $(genero).text()) prefs.splice(i, 1);
        }
        $(genero).toggleClass("selected")
    }

    let divo = document.getElementById("redirect");

    if(prefs.length >= 4){/*  href="index.html" */
        alert(prefs);
        divo.innerHTML = `<a>
                    <button class="btn-continue" onclick="Complementa()">
                        Continue <i class="fa-solid fa-arrow-right"></i>
                    </button>
                </a>`;
    }

    else{
        divo.innerHTML = `<a>
                    <button class="btn-inativo" >
                        Continue <i class="fa-solid fa-arrow-right"></i>
                    </button>
                </a>`;
    }
}

function Complementa(){
    let logado = getmemoria("usuarioLogado");
    let usuarios = getmemoria("usuarios");
    let pose = 0;

    let existe = false;
    for(let i = 0; i < usuarios.length; i++){
        if(usuarios[i].usuario === logado.usuario || usuarios[i].email === logado.email){
            pose = i;
            existe = true;
            break;
        }
    }

    if(existe){
        logado.preferencias = prefs;

        setmemoria("usuarioLogado", logado);
        usuarios[pose] = logado
        setmemoria("usuarios",usuarios);
        window.location.href = 'index.html';
    }
}
