const generos = {
    28:"Ação",
    12: "Aventura",
    16: "Animação",
    35: "Comédia",
    80: "Crime",
    99: "Documentário",
    18: "Drama",
    10751: "Família",
    14: "Fantasia",
    36: "História",
    27: "Terror",
    10402: "Música",
    9648: "Mistério",
    10749: "Romance",
    878: "Ficção científica",
    53: "Thriller",
    10752: "Guerra",
    37: "Faroeste"
};
let nums = 0;

const catalogo = document.querySelector('#container-em-alta');
const prefs = document.querySelector("#prefs");
const slidesContainer = document.querySelector('#carousel-slides');
const usu = getmemoria("usuarioLogado");
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


  catalogo.innerHTML = filmes.map((filme) => criarCartaoFilme(filme)).join('');
}

// ===== Catálogo (preferencias) =====
async function buscarPrefs(id = 16) {  
  try {
    const resposta = await buscarComTimeout(`${TMDB_API_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${id}&language=pt-BR`);
    if (!resposta.ok) throw new Error('Não foi possível acessar a TMDB.');
    const { results } = await resposta.json();
    renderizarPrefs(results, id);
  } catch (erro) {
    prefs.innerHTML = `<div class="catalogo-faixa">
                        <button class="catalogo-prev" type="button" aria-label="Filmes anteriores"><i class="fa-solid fa-chevron-left" aria-hidden="true"></i></button>
                          <div id="container-prefs">
                            <p class="mensagem-catalogo">${mensagemDeErro(erro)}</p>
                          </div>
                        <button class="catalogo-next" type="button" aria-label="Próximos filmes"><i class="fa-solid fa-chevron-right" aria-hidden="true"></i></button>
                       </div>`;
  }
  
}


function renderizarPrefs(filmes, id = 16) {
  if (!filmes?.length) {
    prefs.innerHTML = `<div class="catalogo-faixa">
                    <button class="catalogo-prev" type="button" aria-label="Filmes anteriores"><i class="fa-solid fa-chevron-left" aria-hidden="true"></i></button>
                      <div id="container-prefs">
                        <p class="mensagem-catalogo">Nenhum filme encontrado.</p>
                      </div>
                    <button class="catalogo-next" type="button" aria-label="Próximos filmes"><i class="fa-solid fa-chevron-right" aria-hidden="true"></i></button>
                </div>`;
    return;
  }

  if (usu) {
    prefs.innerHTML += `<h2>${generos[id]}</h2>`;
    let texto = "";
    filmes.forEach(filme => {
        texto += criarCartaoFilme(filme);
    });
    prefs.innerHTML +=`<div class="catalogo-faixa">
    <button class="catalogo-prev" type="button" aria-label="Filmes anteriores" onclick="moverPrefs(this, -1)"><i class="fa-solid fa-chevron-left" aria-hidden="true"></i></button>
    <div id="container-prefs">` + texto + `</div>
                        <button class="catalogo-next" type="button" aria-label="Próximos filmes" onclick="moverPrefs(this, 1)"><i class="fa-solid fa-chevron-right" aria-hidden="true"></i></button>
                    </div>`;
  }
}

function moverCatalogo(direcao) {
  catalogo.scrollBy({ left: direcao * catalogo.clientWidth * 0.8, behavior: 'smooth' });
}
function moverPrefs(obj, direcao) {
  let faixa = obj.parentNode.children[1];
  faixa.scrollBy({ left: direcao * faixa.clientWidth * 0.8, behavior: 'smooth' });
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
    const ano = filme.release_date?.slice(0, 4) || 'Ano não informado';
    const genero = escaparTextoCartao(obterGeneroPrincipal(filme));
    const nota = obterNotaCartao(filme);
    return `
      <a class="slide" href="filme.html?id=${encodeURIComponent(filme.id)}">
        <img class="slide-imagem" src="${imagem}" alt="${escaparTextoCartao(filme.title)}">
        <div class="slide-conteudo">
          <p class="slide-legenda">EM DESTAQUE</p>
          <h1>${escaparTextoCartao(filme.title)}</h1>
          <p class="slide-detalhes">${genero} · ${ano} · Nota ${nota}/5</p>
          <p class="slide-sinopse">${escaparTextoCartao(filme.overview || 'Sinopse não disponível.')}</p>
        </div>
      </a>
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
    const plano = obterPlanoUsuario(infos);
    prefs.children[0].textContent = "Recomendados para você";


    if (plano === "Faísca") {
      fundo.href = "../css/components/fundo_base.css";
      document.getElementById("planos").innerHTML = '';
    }


    else if (plano === "Produtor") {
      fundo.href = "../css/components/produtor.css?v=20261114-3";
      prefs.children[0].textContent = "Baseados em suas preferências";
      document.getElementById("planos").innerHTML = `<div id="container-produtor">
                <button id="botao-produtor" type="button" onclick="produzir()" aria-controls="form-producao" aria-expanded="false">
                    <i class="fa-solid fa-video icone-produtor"></i>
                    <div id="container-produtor-texto">
                        <h1>Comece sua produção</h1>
                        <h2>Descubra novas oportunidades</h2>
                    </div>
                </button>
                <section id="container-catalogo" class="area-producoes">
                  <h1>Minhas produções</h1>
                  <button class="produtor-card" id="botao-produzir" type="button" onclick="produzir()" aria-haspopup="dialog" aria-controls="form-producao">
                    <i class="fa-solid fa-plus" aria-hidden="true"></i>
                    <span>Criar nova produção</span>
                  </button>
                  <div class="lista-producoes" id="lista-producoes"></div>

                  <dialog class="modal-producao" id="form-producao" aria-labelledby="titulo-form-producao">
                    <div class="modal-producao-cabecalho">
                      <div>
                        <p class="modal-producao-sobretitulo">NOVA PRODUÇÃO</p>
                        <h2 id="titulo-form-producao">Informações do filme</h2>
                      </div>
                      <button class="fechar-modal-producao" type="button" onclick="fecharProducao()" aria-label="Fechar formulário">
                        <i class="fa-solid fa-xmark" aria-hidden="true"></i>
                      </button>
                    </div>
                    <form id="formulario-producao">
                      <div class="campo-producao">
                        <label for="titulo-producao">Nome do filme</label>
                        <input id="titulo-producao" name="titulo" type="text" maxlength="120" required>
                      </div>
                      <div class="grade-campos-producao">
                        <div class="campo-producao">
                          <label for="genero-producao">Gênero principal</label>
                          <select id="genero-producao" name="genero" required>
                            <option value="">Selecione um gênero</option>
                            <option>Ação</option><option>Aventura</option><option>Animação</option>
                            <option>Comédia</option><option>Crime</option><option>Documentário</option>
                            <option>Drama</option><option>Fantasia</option><option>Ficção científica</option>
                            <option>Romance</option><option>Suspense</option><option>Terror</option>
                          </select>
                        </div>
                        <div class="campo-producao">
                          <label for="ano-producao">Ano de lançamento</label>
                          <input id="ano-producao" name="ano" type="number" min="1888" max="2100" required>
                        </div>
                      </div>
                      <div class="campo-producao">
                        <label for="sinopse-producao">Sinopse</label>
                        <textarea id="sinopse-producao" name="sinopse" rows="4" maxlength="800" placeholder="Conte um pouco sobre o filme"></textarea>
                      </div>
                      <div class="campo-producao">
                        <label for="poster-producao">Link do pôster <span>(opcional)</span></label>
                        <input id="poster-producao" name="poster" type="url" placeholder="https://">
                      </div>
                      <p class="mensagem-producao" id="mensagem-producao" aria-live="polite"></p>
                      <div class="acoes-modal-producao">
                        <button class="cancelar-producao" type="button" onclick="fecharProducao()">Cancelar</button>
                        <button class="salvar-producao" type="submit">Salvar produção</button>
                      </div>
                    </form>
                  </dialog>
                </section>
            </div>
      `;
    }


    else if (plano === "Administrador") {
      fundo.href = "../css/components/administrador.css";
      prefs.children[0].textContent = "Baseados em suas preferências";
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
      /*  = ""; */
}
}


// ===== Eventos =====


document.querySelector('.prev')?.addEventListener('click', () => moveSlide(-1));
document.querySelector('.next')?.addEventListener('click', () => moveSlide(1));
document.querySelector('.catalogo-prev')?.addEventListener('click', () => moverCatalogo(-1));
document.querySelector('.catalogo-next')?.addEventListener('click', () => moverCatalogo(1));


// ===== Início =====


buscarFilmes();
/* if (usu){
  prefs.innerHTML = `<h1>Recomendados para você</h1>`;
      buscarPrefs(2);
      for (let i = 1; i < 3; i++) {
        let pag = Math.floor(Math.random() * (30 - 3 + 1)) + 3;
        buscarPrefs(pag, i);/* 
        nums = 0; 
      };

}
  prefs.innerHTML = `<h1>Recomendados para você</h1>`;
  for (let i = 1; i < 3; i++) {
    while(nums <= 20){
      let pag = Math.floor(Math.random() * (30 - 3 + 1)) + 3;
      buscarPrefs(pag);
    }
    nums = 0;
  }

} */


if (usu){
  prefs.innerHTML = `<h1>Recomendados para você</h1>`;
  usu.preferencias.forEach(i => {
    buscarPrefs(i);
  });
}


buscarDestaques();


Planos();
document.addEventListener('DOMContentLoaded', Planos);
