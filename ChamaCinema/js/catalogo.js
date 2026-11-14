let containerfilmes = document.getElementById('container-filmes');
let paginaAtual = 1;
let totalPaginas = 1;
let carregando = false;
let numeroRequisicao = 0;
let controleRequisicao;

async function imagemFilme(pagina = 1) {
    const requisicao = ++numeroRequisicao;
    controleRequisicao?.abort();
    controleRequisicao = new AbortController();

    const idgen = document.querySelector('#opcoes').value;
    const ano = document.querySelector('#ano').value;
    const nota = document.querySelector('#nota').value;

    try {
        carregando = true;
        containerfilmes.setAttribute('aria-busy', 'true');
        let url = `${TMDB_API_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=pt-BR&page=${pagina}`;

        if (idgen) {
            url += `&with_genres=${idgen}`;
        }

        if (ano) {
        url += `&primary_release_year=${ano}`;
        }

        if (nota) {
            url += `&vote_average.gte=${Number(nota) * 2}`;
        }

        const resposta = await fetch(url, { signal: controleRequisicao.signal });

        if (!resposta.ok) throw new Error('Não foi possível carregar os filmes.');


        const dados = await resposta.json();
        if (requisicao !== numeroRequisicao) return;

        paginaAtual = dados.page;
        totalPaginas = Math.min(dados.total_pages || 1, 500);
        const filmes = dados.results;
        const anteriorDesabilitado = paginaAtual === 1 ? 'disabled' : '';
        const proximaDesabilitada = paginaAtual >= totalPaginas ? 'disabled' : '';

        containerfilmes.innerHTML = `
            <div class="grade-catalogo">
                ${filmes.length ? filmes.map((filme) => criarCartaoFilme(filme)).join('') : '<p class="mensagem-catalogo">Nenhum filme encontrado.</p>'}
            </div>
            ${filmes.length ? `
                <nav class="paginacao-catalogo" aria-label="Paginação do catálogo">
                    <button type="button" data-pagina="${paginaAtual - 1}" ${anteriorDesabilitado}>Anterior</button>
                    <span>Página ${paginaAtual} de ${totalPaginas}</span>
                    <button type="button" data-pagina="${paginaAtual + 1}" ${proximaDesabilitada}>Próxima</button>
                </nav>
            ` : ''}
        `;

    } catch (error_) {
        if (error_.name !== 'AbortError' && requisicao === numeroRequisicao) {
            console.error(error_);
            containerfilmes.innerHTML = '<p class="mensagem-catalogo">Não foi possível carregar os filmes.</p>';
        }
    } finally {
        if (requisicao === numeroRequisicao) {
            carregando = false;
            containerfilmes.setAttribute('aria-busy', 'false');
        }
    }
}

containerfilmes.addEventListener('click', (evento) => {
    const botao = evento.target.closest('[data-pagina]');
    if (!botao || carregando || botao.disabled) return;

    void imagemFilme(Number(botao.dataset.pagina));
});

document.querySelectorAll('#opcoes, #ano, #nota').forEach((filtro) => {
    filtro.addEventListener('change', () => {
        void imagemFilme(1);
    });
});

function VoltarPadrão() {
    document.querySelector('#opcoes').selectedIndex = 0;
    document.querySelector('#ano').selectedIndex = 0;
    document.querySelector('#nota').selectedIndex = 0;
    void imagemFilme(1);
}

document.addEventListener('DOMContentLoaded', () => {
    void imagemFilme();
}, { once: true });