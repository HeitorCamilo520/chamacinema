const idFilme = new URLSearchParams(window.location.search).get('id');
const detalhesFilme = document.getElementById('detalhes-filme');
let notaAvaliacaoSelecionada = 3;

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

function obterCorNotaFilme(nota) {
  const valor = Number(nota);
  if (!Number.isFinite(valor)) return 'var(--color-white)';
  if (valor >= 4) return 'var(--color-pink)';
  if (valor >= 3) return 'var(--color-red)';
  if (valor >= 2) return 'var(--color-orange)';
  if (valor >= 1) return 'var(--color-yellow)';
  return 'var(--color-white)';
}

function obterImagemChamaNota(nota) {
  const valor = Number(nota);
  if (valor >= 4) return '../Imagens/foguin_rosa.png';
  if (valor >= 3) return '../Imagens/foguin_vermelho.png';
  if (valor >= 2) return '../Imagens/foguin_naranja.png';
  if (valor >= 1) return '../Imagens/foguin_marelo.png';
  return '../Imagens/foguin_branco.png';
}

function criarControleChamasAvaliacao(nota) {
  const botoes = Array.from({ length: 5 }, (_, indice) => {
    const notaMetade = indice + 0.5;
    const notaCompleta = indice + 1;
    return `
      <span class="chama-avaliacao" data-indice-chama="${indice}">
        <img class="chama-avaliacao-base" src="../Imagens/foguin_branco.png" alt="">
        <img class="chama-avaliacao-preenchida" src="${obterImagemChamaNota(nota)}" alt="">
        <button type="button" class="metade-nota-avaliacao metade-esquerda" data-nota-avaliacao="${notaMetade}" aria-label="Nota ${notaMetade.toFixed(1).replace('.', ',')} de 5" aria-pressed="${nota === notaMetade}"></button>
        <button type="button" class="metade-nota-avaliacao metade-direita" data-nota-avaliacao="${notaCompleta}" aria-label="Nota ${notaCompleta.toFixed(1).replace('.', ',')} de 5" aria-pressed="${nota === notaCompleta}"></button>
      </span>
    `;
  }).join('');

  return `<div class="seletor-chamas-avaliacao" role="group" aria-label="Escolha uma nota de meio em meio ponto">${botoes}</div>`;
}

function atualizarVisualChamasAvaliacao(nota, opacidade = 1) {
  const imagem = obterImagemChamaNota(nota);
  detalhesFilme.querySelectorAll('.chama-avaliacao').forEach((chama, indice) => {
    const progresso = Math.max(0, Math.min(1, nota - indice));
    const preenchida = chama.querySelector('.chama-avaliacao-preenchida');
    preenchida.src = imagem;
    preenchida.style.clipPath = `inset(0 ${(1 - progresso) * 100}% 0 0)`;
    preenchida.style.opacity = String(opacidade);
  });
}

function atualizarControleChamasAvaliacao(nota) {
  notaAvaliacaoSelecionada = Math.max(0.5, Math.min(5, Math.round(Number(nota) * 2) / 2));
  atualizarVisualChamasAvaliacao(notaAvaliacaoSelecionada);

  detalhesFilme.querySelectorAll('[data-nota-avaliacao]').forEach(botao => {
    botao.setAttribute('aria-pressed', String(Number(botao.dataset.notaAvaliacao) === notaAvaliacaoSelecionada));
  });
  const valorNota = detalhesFilme.querySelector('#valor-nota-avaliacao');
  valorNota.textContent = `${notaAvaliacaoSelecionada.toFixed(1).replace('.', ',')} / 5`;
  valorNota.style.color = obterCorNotaFilme(notaAvaliacaoSelecionada);
}

function renderizarElenco(elenco) {
  if (!elenco.length) return '<p class="estado-vazio">Elenco não disponível.</p>';
  return elenco.map(pessoa => `
    <a class="cartao-elenco" href="ator.html?id=${encodeURIComponent(pessoa.id)}" aria-label="Ver perfil de ${escaparHtml(pessoa.name)}">
      <img src="${pessoa.profile_path ? `https://image.tmdb.org/t/p/w185${pessoa.profile_path}` : '../Imagens/Geral_1.png'}" alt="Foto de ${escaparHtml(pessoa.name)}" loading="lazy">
      <div><h3>${escaparHtml(pessoa.name)}</h3><p>${escaparHtml(pessoa.character || 'Elenco')}</p></div>
    </a>
  `).join('');
}

function renderizarFilme(filme) {
  const pessoaDiretor = filme.credits.crew.find(pessoa => pessoa.job === 'Director');
  const diretor = pessoaDiretor?.id
    ? `<a href="ator.html?id=${encodeURIComponent(pessoaDiretor.id)}">${escaparHtml(pessoaDiretor.name)}</a>`
    : 'Não informado';
  const trailer = filme.videos.results.find(video => video.site === 'YouTube' && video.type === 'Trailer')
    || filme.videos.results.find(video => video.site === 'YouTube');
  const favorito = filmeEstaFavorito(filme.id);
  const backdrop = filme.backdrop_path ? `https://image.tmdb.org/t/p/w1280${filme.backdrop_path}` : '';
  const sinopse = filme.overview || 'A sinopse deste filme ainda não está disponível.';
  const nota = obterNotaCartao(filme);
  detalhesFilme.style.setProperty('--cor-nota-filme', obterCorNotaFilme(nota));

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
        <div class="nota-filme-api">
          ${criarChamasNota(nota)}
          <strong>${escaparHtml(nota)}</strong>
          <span>/ 5</span>
          <small>Nota TMDB</small>
        </div>
        <div class="generos-filme">${filme.genres.map(genero => `<span>${escaparHtml(genero.name)}</span>`).join('')}</div>
        <p class="sinopse-filme">${escaparHtml(sinopse)}</p>
        ${filme.overview ? '<button type="button" class="botao-sinopse" data-acao="sinopse">Ler sinopse completa <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></button>' : ''}
        <div class="acoes-filme">
          <button type="button" class="botao-acao ${favorito ? 'favorito-ativo' : ''}" data-acao="favorito" aria-label="${favorito ? 'Abrir perfil com filme favoritado' : 'Favoritar filme e abrir perfil'}" aria-pressed="${favorito}"><i class="fa-solid fa-heart" aria-hidden="true"></i><span>${favorito ? 'Favorito' : 'Favoritar'}</span></button>
          <a class="botao-acao" href="#avaliacoes"><i class="fa-regular fa-star" aria-hidden="true"></i><span>Avaliações</span></a>
          <button type="button" class="botao-acao" data-acao="abrir-avaliacao" aria-haspopup="dialog" aria-controls="dialog-avaliacao"><i class="fa-solid fa-fire" aria-hidden="true"></i><span>Avaliar filme</span></button>
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

    <dialog class="dialog-avaliacao" id="dialog-avaliacao" aria-labelledby="titulo-avaliacao">
      <div class="conteudo-dialog-avaliacao">
        <div class="cabecalho-dialog-avaliacao">
          <div>
            <p class="avaliacao-sobretitulo">SUA OPINIÃO</p>
            <h2 id="titulo-avaliacao">Avaliar ${escaparHtml(filme.title)}</h2>
          </div>
          <button type="button" class="fechar-dialog-avaliacao" data-acao="fechar-avaliacao" aria-label="Fechar avaliação"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
        </div>
        <form id="form-avaliacao-filme">
          <div class="campo-avaliacao-filme">
            <p class="rotulo-avaliacao-filme">Sua nota</p>
            <div class="controle-nota-avaliacao">
              ${criarControleChamasAvaliacao(3)}
              <output id="valor-nota-avaliacao">3,0 / 5</output>
            </div>
          </div>
          <div class="campo-avaliacao-filme">
            <label for="comentario-avaliacao-filme">Comentário <span>(opcional)</span></label>
            <textarea id="comentario-avaliacao-filme" name="comentario" rows="4" maxlength="800" placeholder="O que você achou do filme?"></textarea>
          </div>
          <p class="mensagem-avaliacao-filme" id="mensagem-avaliacao-filme" aria-live="polite"></p>
          <div class="acoes-avaliacao-filme">
            <button type="button" class="cancelar-avaliacao-filme" data-acao="fechar-avaliacao">Cancelar</button>
            <button type="submit" class="enviar-avaliacao-filme">Enviar avaliação</button>
          </div>
        </form>
      </div>
    </dialog>

    <section class="ficha-filme" aria-label="Ficha técnica">
      <div><i class="fa-solid fa-clapperboard" aria-hidden="true"></i><span><small>Direção</small><strong>${diretor}</strong></span></div>
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

  const seletorNota = detalhesFilme.querySelector('.seletor-chamas-avaliacao');
  seletorNota.addEventListener('pointerover', evento => {
    const botao = evento.target.closest('[data-nota-avaliacao]');
    if (!botao || evento.pointerType === 'touch') return;
    atualizarVisualChamasAvaliacao(Number(botao.dataset.notaAvaliacao), .35);
  });
  seletorNota.addEventListener('pointerleave', () => {
    atualizarVisualChamasAvaliacao(notaAvaliacaoSelecionada);
  });
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
  const usuario = adicionarFavoritoUsuario(idFilme);
  if (!usuario) {
    window.location.href = 'login.html';
    return;
  }

  botao.classList.add('favorito-ativo');
  botao.setAttribute('aria-pressed', 'true');
  botao.setAttribute('aria-label', 'Abrir perfil com filme favoritado');
  botao.querySelector('span').textContent = 'Favorito';
  window.location.href = 'usuario.html';
}

detalhesFilme.addEventListener('click', evento => {
  const botao = evento.target.closest('[data-elenco], [data-acao], [data-nota-avaliacao]');
  if (!botao) return;

  if (botao.dataset.notaAvaliacao !== undefined) {
    atualizarControleChamasAvaliacao(Number(botao.dataset.notaAvaliacao));
    return;
  }

  if (botao.dataset.elenco) {
    const listaElenco = detalhesFilme.querySelector('#lista-elenco');
    const direcao = botao.dataset.elenco === 'proximo' ? 1 : -1;
    listaElenco.scrollBy({ left: direcao * listaElenco.clientWidth * .8, behavior: 'smooth' });
    return;
  }

  if (botao.dataset.acao === 'favorito') return alternarFavorito(botao);
  if (botao.dataset.acao === 'sinopse') return detalhesFilme.querySelector('#dialog-sinopse').showModal();
  if (botao.dataset.acao === 'fechar-sinopse') return detalhesFilme.querySelector('#dialog-sinopse').close();
  if (botao.dataset.acao === 'abrir-avaliacao') {
    let usuarioAtual = null;
    try {
      usuarioAtual = getmemoria('usuarioLogado');
    } catch {
      usuarioAtual = null;
    }
    if (!usuarioAtual) {
      window.location.href = 'login.html';
      return;
    }

    atualizarControleChamasAvaliacao(3);
    detalhesFilme.querySelector('#mensagem-avaliacao-filme').textContent = '';
    detalhesFilme.querySelector('#comentario-avaliacao-filme').value = '';
    detalhesFilme.querySelector('#dialog-avaliacao').showModal();
    return;
  }
  if (botao.dataset.acao === 'fechar-avaliacao') return detalhesFilme.querySelector('#dialog-avaliacao').close();
});

detalhesFilme.addEventListener('click', evento => {
  if (evento.target.matches('#dialog-sinopse')) evento.target.close();
  if (evento.target.matches('#dialog-avaliacao')) evento.target.close();
});

detalhesFilme.addEventListener('submit', evento => {
  if (!evento.target.matches('#form-avaliacao-filme')) return;
  evento.preventDefault();
  detalhesFilme.querySelector('#mensagem-avaliacao-filme').textContent = 'O envio de avaliações estará disponível em breve.';
});

carregarFilme();