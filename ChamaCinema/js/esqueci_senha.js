function Esquecer(){
    let divo = document.getElementById("aqui");
    let usu = getmemoria("usuarios");
    let email = document.getElementById("email-esqueci_senha").value;

    let existe = false;

    for(let i = 0; i < usu.length; i++){
        if(usu[i].email === email){
            divo.innerHTML = "Senha: " + usu[i].senha;
            existe = true;
            break;
        }
    }
    if (!existe){
        divo.innerHTML = "E-mail não cadastrado";
    }
}
document.getElementById("botao-esqueci_senha")?.addEventListener("click", () => Esquecer());