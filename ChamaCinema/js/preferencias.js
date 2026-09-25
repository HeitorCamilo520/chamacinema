let prefs = [];

function Preferir(genero){
    if (!$(genero).hasClass("selected")){
        prefs.push($(genero).text())
        $(genero).toggleClass("selected")
    }
    else if ($(genero).hasClass("selected")){
        for (let i = 0; i < prefs.length; i++) {
            if(prefs[i] == $(genero).text()) prefs.splice(i, 1);
        }
        $(genero).toggleClass("selected")
    }

    let divo = document.getElementById("redirect");

    if(prefs.length >= 4){/*  href="index.html" */
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
