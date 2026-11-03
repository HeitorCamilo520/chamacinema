const idFilme = new URLSearchParams(window.location.search).get('id');
const detalhesFilme = document.getElementById('detalhes-filme');
const chaveFavoritos = 'filmesFavoritos';

function escaparHtml(valor = '') {
  return String(valor).replace(/[&<>"']/g, caractere => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[caractere]);
}

function formatarData(data) {
  if (!data) return 'Data não informada';
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(`${data}T00:00:00Z`));
}

function formatarDuracao(minutos) {
  if (!minutos) return 'Duração não informada';
  const horas = Math.floor(minutos / 60);
  const resto = minutos % 60;
  return horas ? `${horas}h ${resto}min` : `${resto}min`;
}

function lerFavoritos() {
  try {
    return JSON.parse(localStorage.getItem(chaveFavoritos) || '[]');
  } catch {
    return [];
  }
}

function renderizarElenco(elenco) {
  if (!elenco.length) return '<p class="estado-vazio">Elenco não disponível.</p>';
  return elenco.map(pessoa => `
    <article class="cartao-elenco">
      <img src="${pessoa.profile_path ? `https://image.tmdb.org/t/p/w185${pessoa.profile_path}` : '../Imagens/Geral_1.png'}" alt="Foto de ${escaparHtml(pessoa.name)}" loading="lazy">
      <div><h3>${escaparHtml(pessoa.name)}</h3><p>${escaparHtml(pessoa.character || 'Elenco')}</p></div>
    </article>
  `).join('');
}

function renderizarFilme(filme) {
  const diretor = filme.credits.crew.find(pessoa => pessoa.job === 'Director')?.name || 'Não informado';
  const trailer = filme.videos.results.find(video => video.site === 'YouTube' && video.type === 'Trailer')
    || filme.videos.results.find(video => video.site === 'YouTube');
  const favorito = lerFavoritos().some(item => String(item.id) === String(filme.id));
  const backdrop = filme.backdrop_path ? `https://image.tmdb.org/t/p/w1280${filme.backdrop_path}` : '';
  const sinopse = filme.overview || 'A sinopse deste filme ainda não está disponível.';

  document.title = `${filme.title} | ChamaCinema`;
  detalhesFilme.innerHTML = `
    <section class="hero-filme" ${backdrop ? `style="--imagem-destaque: url('${backdrop}')"` : ''}>
      <div class="filme-capa">
        <img src="${filme.poster_path ? `${TMDB_IMAGE_URL}${filme.poster_path}` : '../Imagens/Geral_1.png'}" alt="Pôster de ${escaparHtml(filme.title)}">
      </div>
      <div class="filme-resumo">
        <p class="sobretitulo">Filme <span aria-hidden="true">/</span> ${filme.release_date?.slice(0, 4) || 'Ano não informado'}</p>
        <h1>${escaparHtml(filme.title)}</h1>
        <div class="metadados-filme">
          <span>${filme.release_date?.slice(0, 4) || 'Ano não informado'}</span><b aria-hidden="true">•</b>
          <span>${formatarDuracao(filme.runtime)}</span><b aria-hidden="true">•</b>
          <span>${escaparHtml(filme.original_language?.toUpperCase() || 'Idioma não informado')}</span>
        </div>
        <div class="generos-filme">${filme.genres.map(genero => `<span>${escaparHtml(genero.name)}</span>`).join('')}</div>
        <p class="sinopse-filme">${escaparHtml(sinopse)}</p>
        ${filme.overview ? '<button type="button" class="botao-sinopse" data-acao="sinopse">Ler sinopse completa <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></button>' : ''}
        <div class="acoes-filme">
          <button type="button" class="botao-acao ${favorito ? 'favorito-ativo' : ''}" data-acao="favorito" aria-pressed="${favorito}"><i class="fa-solid fa-heart" aria-hidden="true"></i><span>${favorito ? 'Favorito' : 'Favoritar'}</span></button>
          <a class="botao-acao" href="#avaliacoes"><i class="fa-regular fa-star" aria-hidden="true"></i><span>Avaliações</span></a>
        </div>
      </div>
      <div class="trailer-filme">
        ${trailer ? `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(trailer.key)}" title="Trailer de ${escaparHtml(filme.title)}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>` : `<img src="${backdrop || '../Imagens/Geral_1.png'}" alt="Imagem de ${escaparHtml(filme.title)}">`}
      </div>
    </section>

    <dialog class="dialog-sinopse" id="dialog-sinopse" aria-labelledby="titulo-sinopse">
      <div class="conteudo-dialog-sinopse">
        <div class="cabecalho-dialog-sinopse">
          <h2 id="titulo-sinopse">Sinopse completa</h2>
          <button type="button" class="fechar-dialog-sinopse" data-acao="fechar-sinopse" aria-label="Fechar sinopse"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
        </div>
        <p>${escaparHtml(sinopse)}</p>
      </div>
    </dialog>

    <section class="ficha-filme" aria-label="Ficha técnica">
      <div><i class="fa-solid fa-clapperboard" aria-hidden="true"></i><span><small>Direção</small><strong>${escaparHtml(diretor)}</strong></span></div>
      <div><i class="fa-solid fa-calendar-days" aria-hidden="true"></i><span><small>Lançamento</small><strong>${formatarData(filme.release_date)}</strong></span></div>
      <div><i class="fa-solid fa-clock" aria-hidden="true"></i><span><small>Duração</small><strong>${formatarDuracao(filme.runtime)}</strong></span></div>
      <div><i class="fa-solid fa-film" aria-hidden="true"></i><span><small>Produção</small><strong>${escaparHtml(filme.production_companies[0]?.name || 'Não informada')}</strong></span></div>
    </section>

    <section class="secao-filme secao-elenco">
      <div class="cabecalho-secao"><h2>Elenco principal</h2><span>${filme.credits.cast.length} artistas</span></div>
      <div class="elenco-trilho">
        <button type="button" class="seta-elenco" data-elenco="anterior" aria-label="Ver elenco anterior" aria-controls="lista-elenco"><i class="fa-solid fa-chevron-left" aria-hidden="true"></i></button>
        <div class="lista-elenco" id="lista-elenco">${renderizarElenco(filme.credits.cast)}</div>
        <button type="button" class="seta-elenco" data-elenco="proximo" aria-label="Ver próximo elenco" aria-controls="lista-elenco"><i class="fa-solid fa-chevron-right" aria-hidden="true"></i></button>
      </div>
    </section>

    <section class="secao-filme secao-avaliacoes" id="avaliacoes">
      <div class="cabecalho-secao cabecalho-avaliacoes">
        <h2>Avaliações</h2>
      </div>
      <p class="estado-vazio estado-avaliacoes">Ainda não há avaliações para este filme.</p>
    </section>
  `;
}

function carregarFilme() {
  if (!idFilme) {
    detalhesFilme.innerHTML = '<p class="mensagem-filme">ID do filme não fornecido.</p>';
    return;
  }

  detalhesFilme.innerHTML = '<p class="mensagem-filme">Carregando detalhes do filme...</p>';
  fetch(`${TMDB_API_URL}/movie/${encodeURIComponent(idFilme)}?language=pt-BR&include_video_language=pt-BR,en-US,null&append_to_response=credits,videos&api_key=${TMDB_API_KEY}`)
    .then(resposta => {
      if (!resposta.ok) throw new Error('Não foi possível carregar os detalhes deste filme.');
      return resposta.json();
    })
    .then(renderizarFilme)
    .catch(error_ => {
      detalhesFilme.innerHTML = `<p class="mensagem-filme">${escaparHtml(error_.message)}</p>`;
    });
}

function alternarFavorito(botao) {
  const favoritos = lerFavoritos();
  const indice = favoritos.findIndex(item => String(item.id) === String(idFilme));
  if (indice >= 0) {
    favoritos.splice(indice, 1);
  } else {
    const titulo = detalhesFilme.querySelector('h1')?.textContent || 'Filme';
    favoritos.push({ id: idFilme, titulo });
  }
  localStorage.setItem(chaveFavoritos, JSON.stringify(favoritos));
  botao.classList.toggle('favorito-ativo', indice < 0);
  botao.setAttribute('aria-pressed', String(indice < 0));
  botao.querySelector('span').textContent = indice < 0 ? 'Favorito' : 'Favoritar';
}

detalhesFilme.addEventListener('click', evento => {
  const botao = evento.target.closest('[data-elenco], [data-acao]');
  if (!botao) return;

  if (botao.dataset.elenco) {
    const listaElenco = detalhesFilme.querySelector('#lista-elenco');
    const direcao = botao.dataset.elenco === 'proximo' ? 1 : -1;
    listaElenco.scrollBy({ left: direcao * listaElenco.clientWidth * .8, behavior: 'smooth' });
    return;
  }

  if (botao.dataset.acao === 'favorito') return alternarFavorito(botao);
  if (botao.dataset.acao === 'sinopse') return detalhesFilme.querySelector('#dialog-sinopse').showModal();
  if (botao.dataset.acao === 'fechar-sinopse') return detalhesFilme.querySelector('#dialog-sinopse').close();
});

detalhesFilme.addEventListener('click', evento => {
  if (evento.target.matches('#dialog-sinopse')) evento.target.close();
});

carregarFilme();