const catalogo = document.querySelector('#container-em-alta');
const slidesContainer = document.querySelector('#carousel-slides');
let currentIndex = 0;

async function buscarComTimeout(url) {
  const controlador = new AbortController();
  const temporizador = setTimeout(() => controlador.abort(), 10000);
  try {
    return await fetch(url, { signal: controlador.signal });
  } finally {
    clearTimeout(temporizador);
  }
}

function mensagemDeErro(erro) {
  return erro.name === 'AbortError'
    ? 'A TMDB demorou para responder. Tente novamente.'
    : erro.message;
}

// ===== Catálogo (filmes em alta) =====

async function buscarFilmes() {
  catalogo.innerHTML = '<p class="mensagem-catalogo">Carregando filmes...</p>';
  try {
    const resposta = await buscarComTimeout(`${TMDB_API_URL}/movie/popular?language=pt-BR&page=1&api_key=${TMDB_API_KEY}`);
    if (!resposta.ok) throw new Error('Não foi possível acessar a TMDB.');
    const { results } = await resposta.json();
    renderizarFilmes(results);
  } catch (erro) {
    catalogo.innerHTML = `<p class="mensagem-catalogo">${mensagemDeErro(erro)}</p>`;
  }
}

function renderizarFilmes(filmes) {
  if (!filmes?.length) {
    catalogo.innerHTML = '<p class="mensagem-catalogo">Nenhum filme encontrado.</p>';
    return;
  }

  catalogo.innerHTML = filmes.map((filme) => `
    <article class="filme-card">
      <img src="${filme.poster_path ? `${TMDB_IMAGE_URL}${filme.poster_path}` : 'Imagens/Geral_1.png'}" alt="Pôster de ${filme.title}">
      <div class="filme-info">
        <h2>${filme.title}</h2>
        <p>${filme.release_date?.slice(0, 4) || 'Ano não informado'} | Nota ${filme.vote_average?.toFixed(1) || 'N/A'}</p>
      </div>
    </article>
  `).join('');
}

function moverCatalogo(direcao) {
  catalogo.scrollBy({ left: direcao * catalogo.clientWidth * 0.8, behavior: 'smooth' });
}

// ===== Carrossel de destaques =====

async function buscarDestaques() {
  try {
    const resposta = await buscarComTimeout(`${TMDB_API_URL}/movie/popular?language=pt-BR&page=1&api_key=${TMDB_API_KEY}`);
    if (!resposta.ok) throw new Error('Não foi possível carregar os destaques.');
    const { results } = await resposta.json();
    renderizarDestaques(results.slice(0, 5));
  } catch (erro) {
    slidesContainer.innerHTML = `<p class="mensagem-carousel">${mensagemDeErro(erro)}</p>`;
  }
}

function renderizarDestaques(filmes) {
  slidesContainer.innerHTML = filmes.map((filme) => {
    const imagem = filme.backdrop_path ? `${TMDB_BACKDROP_URL}${filme.backdrop_path}` : 'Imagens/Geral_6.png';
    return `
      <article class="slide">
        <img class="slide-imagem" src="${imagem}" alt="${filme.title}">
        <div class="slide-conteudo">
          <p class="slide-legenda">EM DESTAQUE</p>
          <h1>${filme.title}</h1>
          <p class="slide-detalhes">${filme.release_date?.slice(0, 4) || 'Ano não informado'} &nbsp; | &nbsp; Nota ${filme.vote_average?.toFixed(1) || 'N/A'}</p>
          <p class="slide-sinopse">${filme.overview || 'Sinopse não disponível.'}</p>
        </div>
      </article>
    `;
  }).join('');

  currentIndex = 0;
  atualizarPosicaoSlide();
}

function moveSlide(direction) {
  const totalSlides = document.querySelectorAll('.slide').length;
  if (!totalSlides) return;

  currentIndex = (currentIndex + direction + totalSlides) % totalSlides;
  atualizarPosicaoSlide();
}

function atualizarPosicaoSlide() {
  slidesContainer.style.transform = `translateX(${-currentIndex * 100}%)`;
}

// ===== Eventos =====

document.querySelector('.prev')?.addEventListener('click', () => moveSlide(-1));
document.querySelector('.next')?.addEventListener('click', () => moveSlide(1));
document.querySelector('.catalogo-prev')?.addEventListener('click', () => moverCatalogo(-1));
document.querySelector('.catalogo-next')?.addEventListener('click', () => moverCatalogo(1));

// ===== Início =====

buscarFilmes();
buscarDestaques();