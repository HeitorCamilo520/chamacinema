// Gêneros idênticos aos da página preferencias.html
const mapGeneros = {
    28: "Ação",
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
    53: "Horror",
    10752: "Guerra",
    37: "Faroeste"
};

// Obras avaliadas padrão (caso o usuário não possua lista dinâmica de avaliações ainda)
const avaliacoesPadrao = [
    { id: 10138, tipo: 'filme', nota: 3.0 }, // 101 Dálmatas II
    { id: 10195, tipo: 'filme', nota: 4.5 }  // O Espetacular Homem-Aranha
];

document.addEventListener('DOMContentLoaded', async () => {
    let usu = getmemoria("usuarioLogado");

    if (!usu) {
        let usuarios = getmemoria("usuarios");
        if (!usuarios) {
            try {
                const resp = await fetch('../json/json_usuarios.json');
                usuarios = await resp.json();
                setmemoria("usuarios", usuarios);
            } catch (e) {
                console.error("Erro ao carregar json_usuarios", e);
            }
        }
        if (usuarios && usuarios.length > 0) {
            usu = usuarios[0];
            setmemoria("usuarioLogado", usu);
        }
    }

    renderizarDadosUsuario(usu);
    await carregarObras(usu);
    configurarModalEdicao();
});

function renderizarDadosUsuario(usu) {
    if (!usu) return;

    document.getElementById('usr-nome').textContent = usu.usuario || "StanLee01";
    document.getElementById('usr-bio').textContent = usu.bio || "Apaixonado por filme de super herói.";
    document.getElementById('usr-registro').textContent = usu.dataRegistro || "Desde Abril de 2026";
    
    if (usu.linkFoto) {
        document.getElementById('usr-foto').src = usu.linkFoto;
    }

    // Moldura do Avatar dinâmico pelo plano
    const avatarMoldura = document.getElementById('usr-avatar-moldura');
    if (avatarMoldura && usu.plano) {
        avatarMoldura.className = 'avatar-circulo';
        if (usu.plano === 'Produtor') avatarMoldura.classList.add('plano-produtor');
        else if (usu.plano === 'Administrador') avatarMoldura.classList.add('plano-administrador');
        else avatarMoldura.classList.add('plano-faisca');
    }

    // Renderiza Tags de Preferências
    const containerTags = document.getElementById('usr-tags');
    containerTags.innerHTML = '';
    if (usu.preferencias && usu.preferencias.length) {
        usu.preferencias.forEach(idGen => {
            const span = document.createElement('span');
            span.className = 'tag-pref';
            span.textContent = mapGeneros[idGen] || "Gênero";
            containerTags.appendChild(span);
        });
    }

    // Contadores Dinâmicos
    const listaAvaliacoes = (usu.avaliacoes && Array.isArray(usu.avaliacoes)) ? usu.avaliacoes : avaliacoesPadrao;
    const qtdFilmes = listaAvaliacoes.filter(a => a.tipo !== 'serie').length || 21;
    const qtdSeries = listaAvaliacoes.filter(a => a.tipo === 'serie').length || 10;
    const qtdFavoritos = (usu.favoritos && Array.isArray(usu.favoritos)) ? usu.favoritos.length : 0;

    document.getElementById('stat-avaliados').textContent = qtdFilmes;
    document.getElementById('stat-series').textContent = qtdSeries;
    document.getElementById('stat-favoritos').textContent = qtdFavoritos;
}

async function carregarObras(usu) {
    const listaAvaliacoes = (usu && usu.avaliacoes && usu.avaliacoes.length > 0)
        ? usu.avaliacoes
        : avaliacoesPadrao;

    const idsFavoritos = (usu && usu.favoritos && Array.isArray(usu.favoritos))
        ? usu.favoritos
        : [];

    const gridAvaliacoes = document.getElementById('grid-avaliacoes');
    gridAvaliacoes.innerHTML = '';

    // Renderizar Avaliações (Sem sumir quando favoritar)
    for (const item of listaAvaliacoes) {
        const id = item.id || item;
        try {
            const resp = await fetch(`${TMDB_API_URL}/movie/${id}?language=pt-BR&api_key=${TMDB_API_KEY}`);
            if (!resp.ok) continue;
            const filme = await resp.json();

            const eFavorito = idsFavoritos.includes(filme.id);
            gridAvaliacoes.innerHTML += criarCardObraHTML(filme, eFavorito);
        } catch (err) {
            console.error("Erro ao carregar filme avaliado:", err);
        }
    }

    // Renderizar Apenas Favoritos Ativos na Seção Meus Favoritos
    await renderizarSecaoFavoritos(idsFavoritos);
}

async function renderizarSecaoFavoritos(idsFavoritos) {
    const gridFavoritos = document.getElementById('grid-favoritos');
    gridFavoritos.innerHTML = '';

    if (!idsFavoritos || idsFavoritos.length === 0) {
        gridFavoritos.innerHTML = '<p class="mensagem-vazio">Nenhum filme ou série favoritado ainda.</p>';
        return;
    }

    for (const id of idsFavoritos) {
        try {
            const resp = await fetch(`${TMDB_API_URL}/movie/${id}?language=pt-BR&api_key=${TMDB_API_KEY}`);
            if (!resp.ok) continue;
            const filme = await resp.json();

            gridFavoritos.innerHTML += criarCardObraHTML(filme, true);
        } catch (err) {
            console.error("Erro ao carregar filme favorito:", err);
        }
    }
}

function criarCardObraHTML(filme, eFavorito) {
    const posterUrl = filme.poster_path ? `${TMDB_IMAGE_URL}${filme.poster_path}` : '../Imagens/Geral_1.png';
    const ano = filme.release_date ? filme.release_date.slice(0, 4) : '2008';
    const genero = (filme.genres && filme.genres.length) ? filme.genres[0].name : 'Super herói';
    const nota = filme.vote_average ? (filme.vote_average / 2).toFixed(1) : '4.0';
    const tituloEscapado = String(filme.title).replace(/'/g, "\\'");

    return `
        <article class="card-obra" data-id="${filme.id}">
            <div class="poster-container">
                <img src="${posterUrl}" alt="${filme.title}" class="poster-midia">
                <button type="button" class="btn-favorito-card ${eFavorito ? 'ativo' : ''}" data-filme-id="${filme.id}" onclick="cliqueFavoritar(event, ${filme.id}, '${tituloEscapado}')">
                    <i class="fa-solid fa-heart"></i>
                </button>
            </div>
            <div class="info-obra">
                <h3 class="titulo-obra">${filme.title}</h3>
                <p class="detalhe-obra">${genero} • ${ano}</p>
                <div class="linha-nota-card">
                    <span class="nota-card">${nota}</span>
                    <div class="chamas-mini">
                        <img src="../Imagens/foguin_rosa.png" alt="Chama">
                        <img src="../Imagens/foguin_rosa.png" alt="Chama">
                        <img src="../Imagens/foguin_rosa.png" alt="Chama">
                        <img src="../Imagens/foguin_rosa.png" alt="Chama">
                        <img src="../Imagens/foguin_rosa.png" alt="Chama" class="meia-chama">
                    </div>
                </div>
            </div>
        </article>
    `;
}

function cliqueFavoritar(event, idFilme, tituloFilme) {
    event.preventDefault();
    
    let usu = getmemoria("usuarioLogado");
    if (!usu) return;

    if (!Array.isArray(usu.favoritos)) {
        usu.favoritos = [];
    }

    const indice = usu.favoritos.indexOf(idFilme);
    let adicionado = false;

    if (indice === -1) {
        usu.favoritos.push(idFilme);
        adicionado = true;
    } else {
        usu.favoritos.splice(indice, 1);
        adicionado = false;
    }

    // Salvar no localStorage
    let usus = getmemoria("usuarios") || [];
    for (let i = 0; i < usus.length; i++) {
        if (usus[i].usuario === usu.usuario || usus[i].email === usu.email) {
            usus[i] = usu;
            break;
        }
    }
    setmemoria("usuarioLogado", usu);
    setmemoria("usuarios", usus);

    // 1. Atualiza visualmente todos os botões de coração deste filme na página sem recarregar a grade de avaliados
    const botoesCoracao = document.querySelectorAll(`button[data-filme-id="${idFilme}"]`);
    botoesCoracao.forEach(btn => {
        btn.classList.toggle('ativo', adicionado);
    });

    // 2. Atualiza os contadores
    document.getElementById('stat-favoritos').textContent = usu.favoritos.length;

    // 3. Atualiza exclusivamente a seção Meus Favoritos
    renderizarSecaoFavoritos(usu.favoritos);

    // 4. Dispara a mensagem Toast com caixa preta e borda colorida
    const mensagem = adicionado 
        ? `"${tituloFilme}" foi adicionado aos seus favoritos!`
        : `"${tituloFilme}" foi removido dos seus favoritos.`;
    exibirToast(mensagem);
}

function exibirToast(mensagem) {
    const toast = document.getElementById('toast-notificacao');
    if (!toast) return;

    toast.textContent = mensagem;
    toast.classList.add('visivel');

    setTimeout(() => {
        toast.classList.remove('visivel');
    }, 3000);
}

function configurarModalEdicao() {
    const modal = document.getElementById('modal-editar');
    const btnAbrir = document.getElementById('btn-abrir-modal');
    const btnCancelar = document.getElementById('btn-cancelar-modal');
    const form = document.getElementById('form-editar-perfil');
    const gridGeneros = document.getElementById('edit-generos-grid');

    btnAbrir.addEventListener('click', () => {
        const usu = getmemoria("usuarioLogado") || {};
        document.getElementById('edit-nome').value = usu.usuario || "StanLee01";
        document.getElementById('edit-bio').value = usu.bio || "Apaixonado por filme de super herói.";
        document.getElementById('edit-foto').value = usu.linkFoto || "../Imagens/StanLee.jpg";

        // Renderiza TODOS os 18 gêneros de preferencias.html
        gridGeneros.innerHTML = '';
        const prefsAtuais = Array.isArray(usu.preferencias) ? usu.preferencias : [];

        Object.keys(mapGeneros).forEach(idGenStr => {
            const idGen = Number(idGenStr);
            const btnGen = document.createElement('button');
            btnGen.type = 'button';
            btnGen.className = `btn-genero-opt ${prefsAtuais.includes(idGen) ? 'selecionado' : ''}`;
            btnGen.textContent = mapGeneros[idGen];
            btnGen.dataset.id = idGen;

            btnGen.addEventListener('click', () => {
                btnGen.classList.toggle('selecionado');
            });

            gridGeneros.appendChild(btnGen);
        });

        modal.showModal();
    });

    btnCancelar.addEventListener('click', () => {
        modal.close();
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let usu = getmemoria("usuarioLogado") || {};
        let usus = getmemoria("usuarios") || [];

        usu.usuario = document.getElementById('edit-nome').value.trim();
        usu.bio = document.getElementById('edit-bio').value.trim();
        usu.linkFoto = document.getElementById('edit-foto').value.trim();

        const botoesSelecionados = gridGeneros.querySelectorAll('.btn-genero-opt.selecionado');
        usu.preferencias = Array.from(botoesSelecionados).map(b => Number(b.dataset.id));

        for (let i = 0; i < usus.length; i++) {
            if (usus[i].email === usu.email || usus[i].usuario === usu.usuario) {
                usus[i] = usu;
                break;
            }
        }

        setmemoria("usuarioLogado", usu);
        setmemoria("usuarios", usus);

        renderizarDadosUsuario(usu);
        if (typeof atualizarOpcaoSairConta === 'function') {
            atualizarOpcaoSairConta();
        }

        modal.close();
        exibirToast("Perfil atualizado com sucesso!");
    });
}