async function getmemoria(local = "usuarios") {
    alert("pegou");
    return localStorage.getItem(local);
}

async function setmemoria(VetObjeto) {
    alert("guardou");
    localStorage.setItem("usuarios", JSON.stringify(VetObjeto));
}
