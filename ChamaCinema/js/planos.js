

function verificarPlano() {
    cprodutor = document.getElementById("container-produtor");
    cfaisca = document.getElementById("container-faisca"); 

if (getmemoria("usuarioLogado")) {
    let infos = getmemoria("usuarioLogado");
  const plano = obterPlanoUsuario(infos);

  if (plano === "Faísca") {
      cfaisca.innerHTML = `
        <p class="preco-plano"><span class="valor-preco">Gratuito</span><span>para sempre</span></p>
        <button class="botao-plano selecionado" type="button" id="faisca"><i class="fa-solid fa-check"></i><span>Selecionado</span></button>`
      cprodutor.innerHTML = `
        <p class="preco-plano"><span class="valor-preco">R$ 59,90</span><span>por mês</span></p>
        <a href="pagamento.html">
        <button class="botao-plano" type="button" id="produtor"><i class="fa-solid fa-tag" aria-hidden="true"></i><span>Assinar</span></button>
        </a>`
    }

    else if (plano === "Produtor") {
      cprodutor.innerHTML = `
        <p class="preco-plano"><span class="valor-preco">R$ 59,90</span><span>por mês</span></p>
        <button class="botao-plano selecionado" type="button" id="produtor"><i class="fa-solid fa-tag" aria-hidden="true"></i><span>Selecionado</span></button>`
      cfaisca.innerHTML = `
        <p class="preco-plano"><span class="valor-preco">Gratuito</span><span>para sempre</span></p>
        <button class="botao-plano selecionado" type="button" id="faisca"><i class="fa-solid fa-ban"></i><span>Não disponivel</span></button>`
    }

    else if (plano === "Administrador") {
      cprodutor.innerHTML = `
        <p class="preco-plano"><span class="valor-preco">R$ 59,90</span><span>por mês</span></p>
        <button class="botao-plano selecionado" type="button" id="produtor"><i class="fa-solid fa-ban"></i><span>Não disponivel</span></button>`
      cfaisca.innerHTML = `
        <p class="preco-plano"><span class="valor-preco">Gratuito</span><span>para sempre</span></p>
        <button class="botao-plano selecionado" type="button" id="faisca"><i class="fa-solid fa-ban"></i><span>Não disponivel</span></button>`
    }

  }
    else if (!getmemoria("usuarioLogado")) {
      fundo.href = "../css/components/fundo_base.css";
}
}

document.addEventListener('DOMContentLoaded', verificarPlano);