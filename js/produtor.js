let currentIndex = 0;

const catalogo = document.querySelector('#container-em-alta');
const slidesContainer = document.querySelector('#carousel-slides');


function escreveUsuarios(){
   fetch('../json/json_usuarios.json')
   .then(resposta => resposta.json())
        .then(usuariosJson => {
          localStorage.setItem("usuarios",JSON.stringify(usuariosJson));
        }
        )
}

async function buscarComTimeout(url) {
  const controlador = new AbortController();
  const temporizador = setTimeout(() => controlador.abort(), 10000);

  try {
    return await fetch(url, { signal: controlador.signal });
  } finally {
    clearTimeout(temporizador);
  }
}

async function buscarFilmes(endpoint = '/movie/popular?language=pt-BR&page=1') {

  catalogo.innerHTML = '<p class="mensagem-catalogo">Carregando filmes...</p>';

  try {
    const separador = endpoint.includes('?') ? '&' : '?';
    const resposta = await buscarComTimeout(`${TMDB_API_URL}${endpoint}${separador}api_key=${TMDB_API_KEY}`);
    if (!resposta.ok) throw new Error('Não foi possível acessar a TMDB.');

    const dados = await resposta.json();
    renderizarFilmes(dados.results);
  } catch (erro) {
    const mensagem = erro.name === 'AbortError'
      ? 'A TMDB demorou para responder. Tente novamente.'
      : erro.message;
    catalogo.innerHTML = `<p class="mensagem-catalogo">${mensagem}</p>`;
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
  const distancia = catalogo.clientWidth * 0.8;
  catalogo.scrollBy({ left: direcao * distancia, behavior: 'smooth' });
}

buscarFilmes();

async function buscarDestaques() {
  try {
    const resposta = await buscarComTimeout(`${TMDB_API_URL}/movie/popular?language=pt-BR&page=1&api_key=${TMDB_API_KEY}`);
    if (!resposta.ok) throw new Error('Não foi possível carregar os destaques.');

    const dados = await resposta.json();
    renderizarDestaques(dados.results.slice(0, 5));
  } catch (erro) {
    const mensagem = erro.name === 'AbortError'
      ? 'A TMDB demorou para responder. Tente novamente.'
      : erro.message;
    slidesContainer.innerHTML = `<p class="mensagem-carousel">${mensagem}</p>`;
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

  const slides = document.querySelectorAll('.slide');
  if (slides.length) {
    currentIndex = 0;
    const slidesTrack = document.querySelector('.carousel-slides');
    if (slidesTrack) {
      slidesTrack.style.transform = 'translateX(0%)';
    }
  }
}

buscarDestaques();

function moveSlide(direction) {
  const slides = document.querySelectorAll('.slide');
  if (!slides.length) return;

  currentIndex += direction;

  if (currentIndex >= slides.length) {
    currentIndex = 0;
  } else if (currentIndex < 0) {
    currentIndex = slides.length - 1;
  }

  const offset = -currentIndex * 100;
  const slidesTrack = document.querySelector('.carousel-slides');
  if (slidesTrack) {
    slidesTrack.style.transform = `translateX(${offset}%)`;
  }
}

const botaoAnterior = document.querySelector('.prev');
const botaoProximo = document.querySelector('.next');

if (botaoAnterior) {
  botaoAnterior.addEventListener('click', () => moveSlide(-1));
}

if (botaoProximo) {
  botaoProximo.addEventListener('click', () => moveSlide(1));
}
