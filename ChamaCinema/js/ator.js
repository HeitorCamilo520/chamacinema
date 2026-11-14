const idAtor = new URLSearchParams(window.location.search).get('id');
const detalhesAtor = document.getElementById('detalhes-ator');

function escaparTextoAtor(valor = '') {
    return String(valor).replace(/[&<>"']/g, caractere => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[caractere]);
}

function formatarDataAtor(data) {
    if (!data) return 'Não informado';
    return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeZone: 'UTC' })
        .format(new Date(`${data}T00:00:00Z`));
}

function renderizarFilmografia(filmes) {
    const filmesUnicos = [...new Map(filmes
        .filter(filme => filme?.id && filme.title)
        .map(filme => [filme.id, filme])).values()]
        .sort((filmeA, filmeB) => (filmeB.popularity || 0) - (filmeA.popularity || 0))
        .slice(0, 18);

    if (!filmesUnicos.length) {
        return '<p class="mensagem-ator">Nenhum filme encontrado na filmografia.</p>';
    }

    return filmesUnicos.map(filme => criarCartaoFilme(filme)).join('');
}

function renderizarAtor(ator) {
    const retrato = ator.profile_path
        ? `${TMDB_IMAGE_URL}${ator.profile_path}`
        : '../Imagens/Geral_1.png';
    const biografia = ator.biography?.trim() || 'Biografia não disponível.';
    const filmes = ator.movie_credits?.cast || [];
    const nome = escaparTextoAtor(ator.name || 'Ator não identificado');
    const apelidos = ator.also_known_as?.slice(0, 3).map(escaparTextoAtor).join(', ');
    const nascimento = formatarDataAtor(ator.birthday);
    const falecimento = ator.deathday ? ` · Faleceu em ${formatarDataAtor(ator.deathday)}` : '';

    document.title = `${nome} | ChamaCinema`;
    detalhesAtor.innerHTML = `
        <section class="hero-ator">
            <div class="ator-retrato">
                <img src="${retrato}" alt="Foto de ${nome}" fetchpriority="high">
            </div>
            <div class="ator-resumo">
                <p class="ator-sobretitulo">${escaparTextoAtor(ator.known_for_department || 'Cinema')}</p>
                <h1>${nome}</h1>
                <dl class="dados-ator">
                    <div><dt>Nascimento</dt><dd>${escaparTextoAtor(nascimento)}${escaparTextoAtor(falecimento)}</dd></div>
                    <div><dt>Local de nascimento</dt><dd>${escaparTextoAtor(ator.place_of_birth || 'Não informado')}</dd></div>
                    <div><dt>Também conhecido como</dt><dd>${apelidos || 'Não informado'}</dd></div>
                </dl>
                <section class="bio-ator" aria-labelledby="titulo-biografia">
                    <h2 id="titulo-biografia">Biografia</h2>
                    <p>${escaparTextoAtor(biografia)}</p>
                </section>
            </div>
        </section>
        <section class="secao-filmografia" aria-labelledby="titulo-filmografia">
            <div class="cabecalho-filmografia">
                <h2 id="titulo-filmografia">Filmografia</h2>
                <span>${filmes.length} filmes</span>
            </div>
            <div class="grade-filmografia">${renderizarFilmografia(filmes)}</div>
        </section>
    `;
}

async function carregarAtor() {
    if (!idAtor || !/^\d+$/.test(idAtor)) {
        detalhesAtor.innerHTML = '<p class="mensagem-ator">ID do ator inválido ou não informado.</p>';
        return;
    }

    try {
        const resposta = await fetch(`${TMDB_API_URL}/person/${encodeURIComponent(idAtor)}?language=pt-BR&append_to_response=movie_credits,external_ids&api_key=${TMDB_API_KEY}`);
        if (!resposta.ok) throw new Error('Não foi possível carregar as informações deste ator.');
        renderizarAtor(await resposta.json());
    } catch (error_) {
        detalhesAtor.innerHTML = `<p class="mensagem-ator">${escaparTextoAtor(error_.message)}</p>`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    void carregarAtor();
}, { once: true });