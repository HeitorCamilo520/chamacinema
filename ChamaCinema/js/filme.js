const id = new URLSearchParams(window.location.search).get('id');

function carregarFilme() {
  if (!id) {
    document.body.innerHTML = '<p class="mensagem-resultados">ID do filme não fornecido.</p>';
    return;
  }

  fetch(`${TMDB_API_URL}/movie/${id}?language=pt-BR&api_key=${TMDB_API_KEY}`)
    .then(resposta => {
      if (!resposta.ok) throw new Error('Não foi possível carregar os detalhes do filme.');
      return resposta.json();
    })
    .then(filme => {
      const detalhesFilme = `
        <h1>${filme.title}</h1>
        <img src="${filme.poster_path ? `${TMDB_IMAGE_URL}${filme.poster_path}` : '../Imagens/Geral_1.png'}" alt="Pôster de ${filme.title}">
        <p>${filme.overview || 'Descrição não disponível.'}</p>
        <p>Data de lançamento: ${filme.release_date || 'Não informada'}</p>
        <p>Nota média: ${filme.vote_average?.toFixed(1) || 'N/A'}</p>
      `;
      document.getElementById('detalhes-filme').innerHTML = detalhesFilme;
    })
    .catch(erro => {
      document.body.innerHTML = `<p class="mensagem-resultados">${erro.message}</p>`;
    });
}

carregarFilme();