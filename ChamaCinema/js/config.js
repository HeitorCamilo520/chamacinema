const TMDB_API_KEY = '1252fb3b6a045009b37647a44f008051';
const TMDB_API_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_URL = 'https://image.tmdb.org/t/p/w500';
const TMDB_BACKDROP_URL = 'https://image.tmdb.org/t/p/w1280';

const nomesGenerosDoCartao = {
    28: 'Ação',
    12: 'Aventura',
    16: 'Animação',
    35: 'Comédia',
    80: 'Crime',
    99: 'Documentário',
    18: 'Drama',
    10751: 'Família',
    14: 'Fantasia',
    36: 'História',
    27: 'Terror',
    10402: 'Música',
    9648: 'Mistério',
    10749: 'Romance',
    878: 'Ficção científica',
    53: 'Suspense',
    10752: 'Guerra',
    37: 'Faroeste'
};

function escaparTextoCartao(valor = '') {
    return String(valor).replace(/[&<>"']/g, caractere => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[caractere]);
}

function obterGeneroPrincipal(filme) {
    return filme.genres?.[0]?.name
        || nomesGenerosDoCartao[filme.genre_ids?.[0]]
        || 'Gênero não informado';
}

function obterNotaCartao(filme) {
    if (filme.vote_average === null || filme.vote_average === undefined || filme.vote_average === '') {
        return 'N/A';
    }
    const notaApi = Number(filme.vote_average);
    return Number.isFinite(notaApi) ? (notaApi / 2).toFixed(1) : 'N/A';
}

function criarChamasNota(nota) {
    const valorNota = Number(nota);
    const notaValida = nota !== 'N/A' && Number.isFinite(valorNota);
    const notaLimitada = notaValida ? Math.max(0, Math.min(5, valorNota)) : 0;
    let corChama = 'branco';

    if (notaLimitada >= 4) corChama = 'rosa';
    else if (notaLimitada >= 3) corChama = 'vermelho';
    else if (notaLimitada >= 2) corChama = 'naranja';
    else if (notaLimitada >= 1) corChama = 'marelo';

    const imagensChama = {
        branco: '../Imagens/foguin_branco.png',
        marelo: '../Imagens/foguin_marelo.png',
        naranja: '../Imagens/foguin_naranja.png',
        vermelho: '../Imagens/foguin_vermelho.png',
        rosa: '../Imagens/foguin_rosa.png'
    };

    const chamas = Array.from({ length: 5 }, (_, indice) => {
        const progresso = Math.max(0, Math.min(1, notaLimitada - indice));
        const acesa = progresso > 0;
        const imagem = acesa ? imagensChama[corChama] : imagensChama.branco;
        const classe = acesa ? 'chama-acesa' : 'chama-apagada';
        const opacidade = progresso > 0 && progresso < 1 ? ` style="opacity: ${progresso}"` : '';

        return `<img class="${classe}" src="${imagem}" alt=""${opacidade}>`;
    }).join('');

    const descricao = notaValida ? `Nota ${nota.replace('.', ',')} de 5` : 'Nota não disponível';
    return `<span class="chamas-nota" role="img" aria-label="${descricao}">${chamas}</span>`;
}

function salvarUsuarioComFavoritos(usuario) {
    localStorage.setItem('usuarioLogado', JSON.stringify(usuario));

    let usuarios = [];
    try {
        usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    } catch {
        usuarios = [];
    }

    const indice = usuarios.findIndex(item =>
        (usuario.email && item.email === usuario.email)
        || (usuario.usuario && item.usuario === usuario.usuario)
    );

    if (indice >= 0) usuarios[indice] = usuario;
    else usuarios.push(usuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
}

function lerUsuarioComFavoritos() {
    let usuario;
    try {
        usuario = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
    } catch {
        return null;
    }

    if (!usuario) return null;
    if (!Array.isArray(usuario.favoritos)) usuario.favoritos = [];

    const favoritosAntigos = localStorage.getItem('filmesFavoritos');
    if (favoritosAntigos) {
        try {
            const idsAntigos = JSON.parse(favoritosAntigos);
            idsAntigos.forEach(item => {
                const id = Number(typeof item === 'object' ? item.id : item);
                const jaExiste = usuario.favoritos.some(favorito =>
                    String(typeof favorito === 'object' ? favorito.id : favorito) === String(id)
                );
                if (Number.isFinite(id) && !jaExiste) usuario.favoritos.push(id);
            });
        } catch {
            localStorage.removeItem('filmesFavoritos');
        }
        salvarUsuarioComFavoritos(usuario);
        localStorage.removeItem('filmesFavoritos');
    }

    return usuario;
}

function filmeEstaFavorito(idFilme) {
    const usuario = lerUsuarioComFavoritos();
    return Boolean(usuario?.favoritos?.some(favorito =>
        String(typeof favorito === 'object' ? favorito.id : favorito) === String(idFilme)
    ));
}

function alternarFavoritoUsuario(idFilme) {
    const usuario = lerUsuarioComFavoritos();
    if (!usuario) return null;

    const id = Number(idFilme);
    if (!Number.isFinite(id)) return null;
    const indice = usuario.favoritos.findIndex(favorito =>
        String(typeof favorito === 'object' ? favorito.id : favorito) === String(id)
    );
    const favorito = indice === -1;

    if (favorito) usuario.favoritos.push(id);
    else usuario.favoritos.splice(indice, 1);

    salvarUsuarioComFavoritos(usuario);
    return { usuario, favorito };
}

function adicionarFavoritoUsuario(idFilme) {
    const usuario = lerUsuarioComFavoritos();
    if (!usuario) return null;

    const id = Number(idFilme);
    if (!Number.isFinite(id)) return null;
    const jaExiste = usuario.favoritos.some(favorito =>
        String(typeof favorito === 'object' ? favorito.id : favorito) === String(id)
    );

    if (!jaExiste) {
        usuario.favoritos.push(id);
        salvarUsuarioComFavoritos(usuario);
    }
    return usuario;
}

function criarCartaoFilme(filme, { permitirFavoritar = false, favorito = false } = {}) {
    const titulo = escaparTextoCartao(filme.title || filme.name || 'Título não informado');
    const ano = (filme.release_date || filme.first_air_date || '').slice(0, 4) || 'Ano não informado';
    const genero = escaparTextoCartao(obterGeneroPrincipal(filme));
    const nota = obterNotaCartao(filme);
    const poster = filme.poster_path
        ? `${TMDB_IMAGE_URL}${filme.poster_path}`
        : '../Imagens/Geral_1.png';
    const tipo = permitirFavoritar ? 'article' : 'a';
    const classe = permitirFavoritar ? 'card-obra media-card' : 'filme-card media-card';
    const estadoFavorito = favorito || filmeEstaFavorito(filme.id);
    const atributos = permitirFavoritar
        ? `data-id="${Number(filme.id)}"`
        : `href="filme.html?id=${encodeURIComponent(filme.id)}" data-id="${Number(filme.id)}"`;
    const classeFavorito = estadoFavorito ? 'ativo' : '';
    const rotuloFavorito = estadoFavorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos';
    const botaoFavorito = `
        <button type="button" class="btn-favorito-card ${classeFavorito}" data-acao-favorito data-filme-id="${Number(filme.id)}" aria-label="${rotuloFavorito}" aria-pressed="${estadoFavorito}">
            <i class="fa-solid fa-heart" aria-hidden="true"></i>
        </button>
    `;

    return `
        <${tipo} class="${classe}" ${atributos}>
            <div class="poster-container">
                <img src="${poster}" alt="Pôster de ${titulo}" class="poster-midia" loading="lazy">
                ${botaoFavorito}
            </div>
            <div class="info-obra">
                <h2 class="titulo-obra">${titulo}</h2>
                <p class="detalhe-obra"><span>${genero}</span><span aria-hidden="true">·</span><span>${escaparTextoCartao(ano)}</span></p>
                <div class="linha-nota-card">
                    ${criarChamasNota(nota)}
                    <span class="nota-card">${nota}</span>
                    <span class="nota-escala">/ 5</span>
                </div>
            </div>
        </${tipo}>
    `;
}

document.addEventListener('click', (evento) => {
    const botao = evento.target.closest('[data-acao-favorito]');
    if (!botao) return;

    evento.preventDefault();
    evento.stopPropagation();

    const idFilme = botao.dataset.filmeId;
    const resultado = alternarFavoritoUsuario(idFilme);
    if (!resultado) {
        window.location.href = 'login.html';
        return;
    }

    document.querySelectorAll('[data-acao-favorito]').forEach(botaoFilme => {
        if (botaoFilme.dataset.filmeId !== String(idFilme)) return;
        botaoFilme.classList.toggle('ativo', resultado.favorito);
        botaoFilme.setAttribute('aria-pressed', String(resultado.favorito));
        botaoFilme.setAttribute('aria-label', resultado.favorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos');
    });

    const cartao = botao.closest('.media-card');
    const titulo = cartao?.querySelector('.titulo-obra')?.textContent || 'Filme';
    document.dispatchEvent(new CustomEvent('favorito:alterado', {
        detail: { id: Number(idFilme), favorito: resultado.favorito, usuario: resultado.usuario, titulo }
    }));
});

function Favoritar(id = 0){
    return adicionarFavoritoUsuario(id);
}
