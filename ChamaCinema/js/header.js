const pesquisa = document.querySelector('#pesquisa');
const formularioPesquisa = pesquisa?.closest('form');
const resultadosPesquisa = document.querySelector('#resultados-pesquisa');
const dropdown = document.getElementById('dropdown_menu');
const usuario = document.getElementById('usuario-login');
let temporizadorPesquisa;

function obterPlanoUsuario(usuarioAtual) {
  if (!usuarioAtual) return '';

  let usuarios = [];
  try {
    usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
  } catch {
    usuarios = [];
  }

  const registro = usuarios.find(conta =>
    (usuarioAtual.email && conta.email === usuarioAtual.email)
    || (usuarioAtual.usuario && conta.usuario === usuarioAtual.usuario)
  );
  const planoSalvo = registro?.plano || usuarioAtual.plano || '';
  const identificadorPlano = String(planoSalvo).trim().toLocaleLowerCase('pt-BR')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const planos = {
    faisca: 'Faísca',
    produtor: 'Produtor',
    administrador: 'Administrador'
  };
  const plano = planos[identificadorPlano] || '';

  if (plano && usuarioAtual.plano !== plano) {
    usuarioAtual.plano = plano;
    const sessao = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
    if (sessao && ((usuarioAtual.email && sessao.email === usuarioAtual.email)
      || (usuarioAtual.usuario && sessao.usuario === usuarioAtual.usuario))) {
      localStorage.setItem('usuarioLogado', JSON.stringify({ ...sessao, plano }));
    }
  }

  return plano;
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
        ? filmes.map((filme) => {
          const titulo = escaparTextoCartao(filme.title);
          const genero = escaparTextoCartao(obterGeneroPrincipal(filme));
          const ano = (filme.release_date || '').slice(0, 4) || 'Ano não informado';
          const nota = obterNotaCartao(filme);
          return `
            <a class="sugestao-filme" href="resultados.html?busca=${encodeURIComponent(filme.title)}">
              <img src="${filme.poster_path ? `${TMDB_IMAGE_URL}${filme.poster_path}` : '../Imagens/Geral_1.png'}" alt="">
              <span>${titulo}<small>${genero} · ${ano} · Nota ${nota}/5</small></span>
            </a>
          `;
        }).join('')
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
  
  if(usuario.parentNode.classList.contains('drop')){
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';

    document.addEventListener('click', (evento) => {
      const botaoDropdown = document.getElementById('dropdown_icon')?.closest('button');

      if (dropdown && !dropdown.contains(evento.target) && !botaoDropdown?.contains(evento.target)) {
        dropdown.style.display = 'none';
      }
    });

  }
}


function atualizarOpcaoSairConta() {
  const tabela = document.querySelector('#dropdown_menu table');
  const sairConta = document.getElementById('sair-conta');
  const usuarioAtual = getmemoria('usuarioLogado');
  const plano = obterPlanoUsuario(usuarioAtual);
  const linkPlano = document.getElementById('dire_plano');
  const acaoPerfilExistente = document.getElementById('acao-perfil');

  acaoPerfilExistente?.remove();
  if (usuarioAtual && linkPlano && (plano === 'Produtor' || plano === 'Administrador')) {
    const acaoPerfil = document.createElement('a');
    acaoPerfil.id = 'acao-perfil';
    acaoPerfil.className = 'opcoes_header';
    acaoPerfil.href = 'index.html';
    acaoPerfil.innerHTML = plano === 'Produtor'
      ? '<i class="fa-solid fa-video icone-header" aria-hidden="true"></i><p>Produções</p>'
      : '<i class="fa-solid fa-user-shield icone-header" aria-hidden="true"></i><p>Administrar</p>';
    linkPlano.after(acaoPerfil);
  }

  if (usuarioAtual) {
    usuario.classList.add('opcoes_header');
    usuario.parentNode.classList.add('drop');
    usuario.innerHTML = `
    <div id="foto">
                <img src="${getmemoria("usuarioLogado").linkFoto}">
            </div>
            <p>${getmemoria("usuarioLogado").usuario}</p>`;

    if (!sairConta) {
      tabela.innerHTML += `
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

  if (!usuarioAtual) {
    usuario.classList.remove('opcoes_header');
    usuario.parentNode.classList.remove('drop');
    usuario.innerHTML = `<a href="login.html" class="opcoes_header"><i class="fa-solid fa-user icone-header" id="pessoa_login"></i><p>Login</p></a>`;
  }

}

function sairDaConta() {
  const usuarios = getmemoria("usuarios").map(u => ({ ...u, logado: false }));
  setmemoria("usuarios", usuarios);
  setmemoria("usuarioLogado", '');
  window.location.reload();
}

function Redirecionador() {
  let fundo =  document.getElementById('estampa');
  /* let planos =  document.getElementById('dire_plano'); */

  if (getmemoria("usuarioLogado")) {
    let infos = getmemoria("usuarioLogado");
    const plano = obterPlanoUsuario(infos);
    $("#dire_plano").attr("href", "planos.html");

    if (plano === "Faísca") {
      fundo.href = "../css/components/fundo_base.css";
    }

    else if (plano === "Produtor") {
      fundo.href = "../css/components/produtor.css?v=20261114-3";
    }

    else if (plano === "Administrador") {
      fundo.href = "../css/components/administrador.css";
    }

  }
    else if (!getmemoria("usuarioLogado")) {
      fundo.href = "../css/components/fundo_base.css";
  }
}

document.addEventListener('DOMContentLoaded', atualizarOpcaoSairConta);
document.addEventListener('DOMContentLoaded', Redirecionador);
