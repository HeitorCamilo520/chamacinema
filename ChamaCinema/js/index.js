const catalogo = document.querySelector('#container-em-alta');
const CatalogoP = document.querySelector('#container-prefs');
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

// ===== Catálogo (preferencias) =====
async function buscarPrefs() {
  let pag = Math.floor(Math.random() * (20 - 2 + 1)) + 2;
  
  CatalogoP.innerHTML = '<p class="mensagem-catalogo">Carregando filmes...</p>';
  try {
    const resposta = await buscarComTimeout(`${TMDB_API_URL}/movie/popular?language=pt-BR&page=${pag}&api_key=${TMDB_API_KEY}`);

    if (!resposta.ok) throw new Error('Não foi possível acessar a TMDB.');
    const { results } = await resposta.json();
    renderizarPrefs(results);
  } catch (erro) {
    CatalogoP.innerHTML = `<p class="mensagem-catalogo">${mensagemDeErro(erro)}</p>`;
  }

}

function renderizarPrefs(filmes) {
  if (!filmes?.length) {
    CatalogoP.innerHTML = '<p class="mensagem-catalogo">Nenhum filme encontrado.</p>';
    return;
  }
  CatalogoP.innerHTML = "";

  let usu = getmemoria("usuarioLogado");

  if (usu) {
    filmes.forEach(i => {
      if (i.genre_ids.some(elemento => usu.preferencias.includes(elemento))) {
        CatalogoP.innerHTML += `
          <article class="filme-card">
            <img src="${i.poster_path ? `${TMDB_IMAGE_URL}${i.poster_path}` : 'Imagens/Geral_1.png'}" alt="Pôster de ${i.title}">
            <div class="filme-info">
              <h2>${i.title}</h2>
              <p>${i.release_date?.slice(0, 4) || 'Ano não informado'} | Nota ${i.vote_average?.toFixed(1) || 'N/A'}</p>
            </div>
          </article>`
      }
    
    });
  }
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


// ===== Planos =====


function Planos() {


let fundo =  document.getElementById('estampa');


  if (getmemoria("usuarioLogado")) {
    let infos = getmemoria("usuarioLogado");


    if (infos['plano'] == "Faísca") {
      fundo.href = "../css/components/fundo_base.css";
      document.getElementById("planos").innerHTML = '';
    }


    else if (infos['plano'] == "Produtor") {
      fundo.href = "../css/components/produtor.css";
      document.getElementById("planos").innerHTML = `<div id="container-produtor">
                <button id="botao-produtor">
                    <i class="fa-solid fa-video icone-produtor"></i>
                    <div id="container-produtor-texto">
                        <h1>Comece sua produção</h1>
                        <h2>Descubra novas oportunidades</h2>
                    </div>
                </button>
                <div id="container-catalogo">
                  <h1>Minhas produções</h1>
                  <div class="catalogo-faixa">
                  <button class="produtor-card">
                    <div id="container-produtor-texto">
                      <h1><i class="fa-solid fa-plus"></i></h1>
                      <h2>Criar nova produção</h2>
                    </div>
                  </button>
                  <article class="filme-card">
                    <img>
                  </article>
                  </div>
                </div>                                                      
            </div>
      `;
    }


    else if (infos['plano'] == "Administrador") {
      fundo.href = "../css/components/administrador.css";
      document.getElementById("planos").innerHTML = `<div id="container-administrador">
                <button id="botao-administrador">
                    <i class="fa-solid fa-user-shield icone-administrador"></i>
                    <div id="container-administrador-texto">
                        <h1>Gerenciar</h1>
                        <h2>Gerencie usuários e obras</h2>
                    </div>
                </button>
      `;
    }


  }
    else if (!getmemoria("usuarioLogado")) {
      fundo.href = "../css/components/fundo_base.css";
}
}


// ===== Eventos =====


document.querySelector('.prev')?.addEventListener('click', () => moveSlide(-1));
document.querySelector('.next')?.addEventListener('click', () => moveSlide(1));
document.querySelector('.catalogo-prev')?.addEventListener('click', () => moverCatalogo(-1));
document.querySelector('.catalogo-next')?.addEventListener('click', () => moverCatalogo(1));


// ===== Início =====


buscarFilmes();
buscarPrefs();
buscarDestaques();


Planos();
document.addEventListener('DOMContentLoaded', Planos);
