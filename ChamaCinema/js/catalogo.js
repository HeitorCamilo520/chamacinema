async function imagemFilme(alface, idgen) {

        let tomate = document.getElementById(alface);

    try {
        
        const resposta = await fetch(`${TMDB_API_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${idgen}&language=pt-BR`);

        if (!resposta.ok) throw new Error('Não foi possível carregar os filmes.');

        const dados = await resposta.json();
        const filmes = dados.results.slice(0, 6);

        if (!tomate.classList.contains('visivel')) {
            tomate.classList.add('visivel');
            tomate.innerHTML = filmes.map((filme) => `
                <a class="filme-card" href="filme.html?id=${encodeURIComponent(filme.id)}">
                    <img src="${filme.poster_path ? `${TMDB_IMAGE_URL}${filme.poster_path}` : 'Imagens/Geral_1.png'}" alt="Pôster de ${filme.title}">
                    <div class="filme-info">
                        <h2>${filme.title}</h2>
                        <p>${filme.release_date?.slice(0, 4) || 'Ano não informado'} | Nota ${filme.vote_average?.toFixed(1) || 'N/A'}</p>
                    </div>
                </a>
            `).join('');
        }
        else {
            tomate.classList.remove('visivel');
            tomate.innerHTML = '';
        }
    

    } catch (erro) {
        console.error(erro);
    }
}