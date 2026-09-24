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

    let bot = document.getElementById("butao");

    if(prefs.length >= 4){
        bot.classList.add("btn-continue");
        bot.classList.remove("btn-inativo");
    }

    else{
        bot.classList.remove("btn-continue");
        bot.classList.add("btn-inativo");
    }
}
