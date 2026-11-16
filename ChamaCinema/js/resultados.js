const conteudoResultados = document.querySelector('#conteudo-resultados');
const seletorTipoResultados = document.querySelector('.seletor-tipo-resultados');
const botoesTipoResultados = Array.from(document.querySelectorAll('[data-tipo]'));
const parametrosBusca = new URLSearchParams(window.location.search);
const termo = parametrosBusca.get('busca')?.trim() || '';
const tipoInicial = parametrosBusca.get('tipo') === 'atores' ? 'atores' : 'filmes';
const itensPorPagina = 20;
let tipoAtual = tipoInicial;
let paginaAtual = 1;
let totalPaginas = 1;
let carregando = false;

if (pesquisa) pesquisa.value = termo;

function atualizarSeletorTipo() {
  botoesTipoResultados.forEach(botao => {
    const selecionado = botao.dataset.tipo === tipoAtual;
    botao.classList.toggle('selecionado', selecionado);
    botao.setAttribute('aria-pressed', String(selecionado));
  });
}

function atualizarUrlTipo() {
  const parametros = new URLSearchParams(window.location.search);
  parametros.set('tipo', tipoAtual);
  window.history.replaceState(null, '', `${window.location.pathname}?${parametros.toString()}`);
}

function traduzirDepartamentoPessoa(departamento) {
  const traducoes = {
    Acting: 'Atuação',
    Directing: 'Direção',
    Writing: 'Roteiro',
    Production: 'Produção'
  };
  return traducoes[departamento] || departamento || 'Cinema';
}

function criarCartaoAtor(ator) {
  const nome = escaparTextoCartao(ator.name || 'Ator não identificado');
  const imagem = ator.profile_path
    ? `https://image.tmdb.org/t/p/w342${ator.profile_path}`
    : '../Imagens/Geral_1.png';
  const conhecidos = (ator.known_for || [])
    .map(obra => obra.title || obra.name)
    .filter(Boolean)
    .slice(0, 3)
    .map(escaparTextoCartao)
    .join(', ');

  return `
    <a class="resultado-ator" href="ator.html?id=${encodeURIComponent(ator.id)}" aria-label="Ver perfil de ${nome}">
      <img src="${imagem}" alt="Foto de ${nome}" loading="lazy">
      <div class="resultado-ator-info">
        <h2>${nome}</h2>
        <p>${escaparTextoCartao(traduzirDepartamentoPessoa(ator.known_for_department))}</p>
        ${conhecidos ? `<small>Conhecido por ${conhecidos}</small>` : ''}
      </div>
    </a>
  `;
}

async function carregarResultados(pagina = 1) {
  if (!termo) {
    conteudoResultados.innerHTML = '<p class="mensagem-resultados">Digite o nome de um filme ou ator para pesquisar.</p>';
    return;
  }

  carregando = true;
  conteudoResultados.innerHTML = '<p class="mensagem-resultados">Carregando resultados...</p>';

  try {
    const tipoEndpoint = tipoAtual === 'atores' ? 'person' : 'movie';
    const resposta = await fetch(`${TMDB_API_URL}/search/${tipoEndpoint}?language=pt-BR&query=${encodeURIComponent(termo)}&page=${pagina}&api_key=${TMDB_API_KEY}`);
    if (!resposta.ok) throw new Error('Não foi possível carregar os resultados.');

    const dados = await resposta.json();
    paginaAtual = dados.page;
    totalPaginas = Math.min(dados.total_pages, 500);
    const resultados = tipoAtual === 'atores'
      ? dados.results.filter(pessoa => pessoa.known_for_department === 'Acting')
        .sort((pessoaA, pessoaB) => pessoaB.popularity - pessoaA.popularity)
        .slice(0, itensPorPagina)
      : dados.results
        .sort((filmeA, filmeB) => filmeB.popularity - filmeA.popularity)
        .slice(0, itensPorPagina);
    const cartoes = tipoAtual === 'atores'
      ? resultados.map(criarCartaoAtor).join('')
      : resultados.map(filme => criarCartaoFilme(filme)).join('');
    const rotuloTipo = tipoAtual === 'atores' ? 'atores' : 'filmes';
    const botaoAnteriorDesabilitado = paginaAtual === 1 ? 'disabled' : '';
    const botaoProximoDesabilitado = paginaAtual >= totalPaginas ? 'disabled' : '';

    conteudoResultados.innerHTML = `
      <h1>Resultados de ${rotuloTipo} para “${escaparTextoCartao(termo)}”</h1>
      <div class="grade-resultados">
        ${cartoes || `<p class="mensagem-resultados">Nenhum ${tipoAtual === 'atores' ? 'ator' : 'filme'} encontrado.</p>`}
      </div>
      ${resultados.length ? `
        <nav class="paginacao-resultados" aria-label="Paginação dos resultados">
          <button type="button" data-pagina="${paginaAtual - 1}" ${botaoAnteriorDesabilitado}>Anterior</button>
          <span>Página ${paginaAtual} de ${totalPaginas}</span>
          <button type="button" data-pagina="${paginaAtual + 1}" ${botaoProximoDesabilitado}>Próxima</button>
        </nav>
      ` : ''}
    `;
  } catch (error_) {
    conteudoResultados.innerHTML = `<p class="mensagem-resultados">${escaparTextoCartao(error_.message)}</p>`;
  } finally {
    carregando = false;
  }
}

seletorTipoResultados.addEventListener('click', evento => {
  const botao = evento.target.closest('[data-tipo]');
  if (!botao || botao.dataset.tipo === tipoAtual) return;

  tipoAtual = botao.dataset.tipo;
  paginaAtual = 1;
  atualizarSeletorTipo();
  atualizarUrlTipo();
  void carregarResultados(1);
});

conteudoResultados.addEventListener('click', (evento) => {
  const botao = evento.target.closest('[data-pagina]');
  if (!botao || carregando || botao.disabled) return;

  void carregarResultados(Number(botao.dataset.pagina));
});

atualizarSeletorTipo();
document.addEventListener('DOMContentLoaded', () => {
  void carregarResultados(1);
}, { once: true });