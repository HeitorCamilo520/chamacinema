const listaResultados = document.querySelector('#lista-resultados');
const termo = new URLSearchParams(window.location.search).get('busca')?.trim() || '';
const filmesPorPagina = 20;
let paginaAtual = 1;
let totalPaginas = 1;
let carregando = false;

pesquisa.value = termo;

async function carregarResultados(pagina = 1) {
  if (!termo) {
    listaResultados.innerHTML = '<p class="mensagem-resultados">Digite um filme para pesquisar.</p>';
    return;
  }

  carregando = true;
  listaResultados.innerHTML = '<p class="mensagem-resultados">Carregando resultados...</p>';

  try {
    const resposta = await fetch(`${TMDB_API_URL}/search/movie?language=pt-BR&query=${encodeURIComponent(termo)}&page=${pagina}&api_key=${TMDB_API_KEY}`);
    if (!resposta.ok) throw new Error('Não foi possível carregar os resultados.');

    const dados = await resposta.json();
    paginaAtual = dados.page;
    totalPaginas = Math.min(dados.total_pages, 500);
    const filmes = dados.results
      .slice(0, filmesPorPagina)
      .sort((filmeA, filmeB) => filmeB.popularity - filmeA.popularity);

    listaResultados.innerHTML = `
      <h1>Resultados para “${termo}”</h1>
      <div class="grade-resultados">
        ${filmes.length ? filmes.map((filme) => `
          <article class="filme-card">
            <img src="${filme.poster_path ? `${TMDB_IMAGE_URL}${filme.poster_path}` : 'Imagens/Geral_1.png'}" alt="Pôster de ${filme.title}">
            <div class="filme-info">
              <h2>${filme.title}</h2>
              <p>${filme.release_date?.slice(0, 4) || 'Ano não informado'} | Nota ${filme.vote_average?.toFixed(1) || 'N/A'}</p>
            </div>
          </article>
        `).join('') : '<p class="mensagem-resultados">Nenhum filme encontrado.</p>'}
      </div>
      ${filmes.length ? `
        <nav class="paginacao-resultados" aria-label="Paginação dos resultados">
          <button type="button" data-pagina="${paginaAtual - 1}" ${paginaAtual === 1 ? 'disabled' : ''}>Anterior</button>
          <span>Página ${paginaAtual} de ${totalPaginas}</span>
          <button type="button" data-pagina="${paginaAtual + 1}" ${paginaAtual >= totalPaginas ? 'disabled' : ''}>Próxima</button>
        </nav>
      ` : ''}
    `;
  } catch (erro) {
    listaResultados.innerHTML = `<p class="mensagem-resultados">${erro.message}</p>`;
  } finally {
    carregando = false;
  }
}

listaResultados.addEventListener('click', (evento) => {
  const botao = evento.target.closest('[data-pagina]');
  if (!botao || carregando || botao.disabled) return;

  carregarResultados(Number(botao.dataset.pagina));
});

carregarResultados(1);