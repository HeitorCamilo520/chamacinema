async function getmemoria(local = "usuarios") {
    return localStorage.getItem(local);
}

async function setmemoria(VetObjeto) {
    localStorage.setItem("usuarios", JSON.stringify(VetObjeto));
}
