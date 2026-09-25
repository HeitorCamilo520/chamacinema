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

    if(prefs.length >= 4){
        divo.innerHTML = `<a href="index.html">
                    <button class="btn-continue" id="butao">
                        Continue <i class="fa-solid fa-arrow-right"></i>
                    </button>
                </a>`;
    }

    else{
        divo.innerHTML = `<a>
                    <button class="btn-inativo" id="butao">
                        Continue <i class="fa-solid fa-arrow-right"></i>
                    </button>
                </a>`;
    }
}
