function getmemoria(local = "usuarios") {
    let dados = localStorage.getItem(local);
    return dados ? JSON.parse(dados) : null
}

function setmemoria(chave = "usuarios", VetObjeto) {
    localStorage.setItem(chave, JSON.stringify(VetObjeto));
}
