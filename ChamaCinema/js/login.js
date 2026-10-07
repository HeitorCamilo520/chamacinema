const pesquisa = document.querySelector('#pesquisa');
const formularioPesquisa = pesquisa?.closest('form');
const resultadosPesquisa = document.querySelector('#resultados-pesquisa');
const dropdown = document.getElementById('dropdown_menu');
let temporizadorPesquisa;

if(!getmemoria("usuarios")){
        fetch('../json/json_usuarios.json')
        .then(resposta => resposta.json())
        .then(usuariosJson =>{
            setmemoria("usuarios", usuariosJson);
        })
    }

function redirecionarParaResultados() {
  const termo = pesquisa?.value.trim();
  if (termo) window.location.href = `resultados.html?busca=${encodeURIComponent(termo)}`;
}

formularioPesquisa?.addEventListener('submit', (evento) => {
  evento.preventDefault();
  redirecionarParaResultados();
});

document.querySelector('#lupa')?.addEventListener('click', redirecionarParaResultados);

pesquisa?.addEventListener('input', () => {
  clearTimeout(temporizadorPesquisa);
  const termo = pesquisa.value.trim();

  if (termo.length < 2 || !resultadosPesquisa) {
    if (resultadosPesquisa) {
      resultadosPesquisa.innerHTML = '';
      resultadosPesquisa.hidden = true;
    }
    return;
  }

  temporizadorPesquisa = setTimeout(async () => {
    resultadosPesquisa.hidden = false;
    resultadosPesquisa.innerHTML = '<p class="mensagem-pesquisa">Procurando...</p>';

    try {
      const resposta = await fetch(`${TMDB_API_URL}/search/movie?language=pt-BR&query=${encodeURIComponent(termo)}&page=1&api_key=${TMDB_API_KEY}`);
      if (!resposta.ok) throw new Error('Não foi possível carregar as sugestões.');

      const dados = await resposta.json();
      const filmes = dados.results.slice(0, 5);
      resultadosPesquisa.innerHTML = filmes.length
        ? filmes.map((filme) => `
          <a class="sugestao-filme" href="resultados.html?busca=${encodeURIComponent(filme.title)}">
            <img src="${filme.poster_path ? `${TMDB_IMAGE_URL}${filme.poster_path}` : 'Imagens/Geral_1.png'}" alt="">
            <span>${filme.title}<small>${filme.release_date?.slice(0, 4) || 'Ano não informado'}</small></span>
          </a>
        `).join('')
        : '<p class="mensagem-pesquisa">Nenhum filme encontrado.</p>';
    } catch (error_) {
      resultadosPesquisa.innerHTML = `<p class="mensagem-pesquisa">${error_.message}</p>`;
    }
  }, 350);
});

document.addEventListener('click', (evento) => {
  if (resultadosPesquisa && !formularioPesquisa?.contains(evento.target)) {
    resultadosPesquisa.hidden = true;
  }
});

function dropdownMenu() {
  dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';

    document.addEventListener('click', (evento) => {
    const botaoDropdown = document.getElementById('usuario-login');
    if (dropdown && !dropdown.contains(evento.target) && !botaoDropdown?.contains(evento.target)) {
      dropdown.style.display = 'none';
    }
  });
}


function atualizarOpcaoSairConta() {
  const tabela = document.querySelector('#dropdown_menu table');
  const sairConta = document.getElementById('sair-conta');
  const usuario = document.getElementById('usuario-login');

  if (getmemoria("usuarioLogado")) {
    usuario.innerHTML = `
    <div id="foto">
                <img src="${getmemoria("usuarioLogado").linkFoto}">
            </div>
            <p>${getmemoria("usuarioLogado").usuario}</p>`;

    if (!sairConta) {
      tabela.innerHTML += `

        <tr>
          <td>
            <p>
                <i class="fa-solid fa-gear"></i>
                Configurações
            </p>
         </td>
        </tr>
        <tr>
          <td id="adicionar-conta" onclick="adicionarConta()">
              <p>
                <i class="fa-solid fa-plus"></i>
                Adicionar conta
              </p>
          </td>
        </tr>
        <tr id="sair-conta" onclick="sairDaConta()">
          <td>
            <p>
              <i class="fa-solid fa-right-from-bracket"></i>
              Sair da conta
            </p>
          </td>
        </tr>`;
    }
  }
  else if (sairConta) {
    sairConta.remove();
  }

  if (!getmemoria("usuarioLogado")) {
    usuario.innerHTML = `<a href="login.html" class="opcoes_header"><i class="fa-solid fa-user icone-header" id="pessoa_login"></i><p>Login</p></a>`;
  }

}

function sairDaConta() {
  const usuarios = getmemoria("usuarios").map(u => ({ ...u, logado: false }));
  setmemoria("usuarios", usuarios);
  setmemoria("usuarioLogado", '');
  window.location.reload();
}

function adicionarConta(){
  const usuarios = getmemoria("usuarios");
  let usuUsoAtual = usuarios.find(
    u => (u.emUso === true));
  
  if(usuUsoAtual){
    usuUsoAtual.emUso = false;
  }

  window.location.href = 'login.html';


}

function Redirecionador() {
  let fundo =  document.getElementById('estampa');
  /* let planos =  document.getElementById('dire_plano'); */

  if (getmemoria("usuarioLogado")) {
    let infos = getmemoria("usuarioLogado");
    $("#dire_plano").attr("href", "planos.html");

    if (infos["plano"] == "Faísca") {
      fundo.href = "../css/components/fundo_base.css";
    }

    else if (infos["plano"] == "Produtor") {
      fundo.href = "../css/components/produtor.css";
    }

    else if (infos["plano"] == "Administrador") {
      fundo.href = "../css/components/administrador.css";
    }

  }
    else if (!getmemoria("usuarioLogado")) {
      fundo.href = "../css/components/fundo_base.css";
      $("#dire_plano").attr("href", "login.html");
  }
}

document.addEventListener('DOMContentLoaded', atualizarOpcaoSairConta);
document.addEventListener('DOMContentLoaded', Redirecionador);
