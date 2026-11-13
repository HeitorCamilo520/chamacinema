let containerfilmes = document.getElementById('container-filmes');

async function imagemFilme() {

    let idgen = document.querySelector('#opcoes').value;
    let ano = document.querySelector('#ano').value;
    let nota = document.querySelector('#nota').value;
    
    console.log(ano);

    try {
        let url = (`${TMDB_API_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=pt-BR`);

        if (idgen) {
            url += `&with_genres=${idgen}`;
        }

        if (ano) {
        url += `&primary_release_year=${ano}`;
        }

        if (nota) {
            url += `&vote_average.gte=${nota}`;
        }

        const resposta = await fetch(url);

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

function VoltarPadrão() {
    document.querySelector('#opcoes').selectedIndex = 0;
    document.querySelector('#ano').selectedIndex = 0;
    document.querySelector('#nota').selectedIndex = 0;
    imagemFilme();
}

imagemFilme();