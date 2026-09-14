const TMDB_IMAGE_URL = 'https://image.tmdb.org/t/p/w500';
const TMDB_BACKDROP_URL = 'https://image.tmdb.org/t/p/w1280';

const pesquisa = document.querySelector('#pesquisa');
const formularioPesquisa = pesquisa?.closest('form');
const resultadosPesquisa = document.querySelector('#resultados-pesquisa');
let temporizadorPesquisa;

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
    } catch (erro) {
      resultadosPesquisa.innerHTML = `<p class="mensagem-pesquisa">${erro.message}</p>`;
    }
  }, 350);
});

document.addEventListener('click', (evento) => {
  if (resultadosPesquisa && !formularioPesquisa?.contains(evento.target)) {
    resultadosPesquisa.hidden = true;
  }
});