async function imagemFilme(idgen) {

    let containerfilmes = document.getElementById('container-filmes');

    try {

        const resposta = await fetch(`${TMDB_API_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${idgen}&language=pt-BR`);

        if (!resposta.ok) throw new Error('Não foi possível carregar os filmes.');

        const dados = await resposta.json();
        const filmes = dados.results.slice(0, 18);

        containerfilmes.innerHTML = filmes.map((filme) => `
            <a class="filme-card" href="filme.html?id=${encodeURIComponent(filme.id)}">
                <img src="${filme.poster_path ? `${TMDB_IMAGE_URL}${filme.poster_path}` : 'Imagens/Geral_1.png'}" alt="Pôster de ${filme.title}">
                <div class="filme-info">
                    <h2>${filme.title}</h2>
                    <p>${filme.release_date?.slice(0, 4) || 'Ano não informado'} | Nota ${filme.vote_average?.toFixed(1) || 'N/A'}</p>
                </div>
            </a>
        `).join('');

    } catch (erro) {
        console.error(erro);
    }
}

async function fundoimagem() {

    const generos = [28, 12, 16, 35, 80, 99, 18, 10751, 14, 36, 27, 10402, 9648, 10749, 878, 53, 10752, 37];

    for (const idgen of generos) {

        try {

            const resposta = await fetch(`${TMDB_API_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${idgen}&language=pt-BR`);

            if (!resposta.ok) throw new Error('Erro ao carregar filme.');

            const dados = await resposta.json();

            const filme = dados.results[0];

            if (filme && filme.backdrop_path) {

                const botao = document.getElementById(`genero-${idgen}`);

                botao.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.85)), url('${TMDB_IMAGE_URL}${filme.backdrop_path}')`;

            }

        } catch (erro) {
            console.error(`Erro no gênero ${idgen}:`, erro);
        }
    }
}

fundoimagem();