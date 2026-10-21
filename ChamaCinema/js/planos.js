

function verificarPlano() {
    faisca = document.getElementById("faisca");
    produtor = document.getElementById("produtor"); 

if (getmemoria("usuarioLogado")) {
    let infos = getmemoria("usuarioLogado");

    if (infos['plano'] == "Faísca") {
      faisca.classList.add("selecionado");
      faisca.innerHTML = `<i class="fa-solid fa-check"></i></i><span>Selecionado</span>`
    }

    else if (infos['plano'] == "Produtor") {
      produtor.classList.add("selecionado");
      faisca.classList.add("selecionado");
      produtor.innerHTML = `<i class="fa-solid fa-check"></i></i><span>Selecionado</span>`
      faisca.innerHTML = `<i class="fa-solid fa-check"></i></i><span>Não disponivel</span>`
    }

    else if (infos['plano'] == "Administrador") {
    }

  }
    else if (!getmemoria("usuarioLogado")) {
      fundo.href = "../css/components/fundo_base.css";
}
}

document.addEventListener('DOMContentLoaded', verificarPlano);