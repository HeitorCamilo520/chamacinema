function produzir() {
    const dialogo = document.getElementById('form-producao');
    if (!dialogo || dialogo.open) return;

    dialogo.showModal();
    document.getElementById('botao-produtor')?.setAttribute('aria-expanded', 'true');
    document.getElementById('botao-produzir')?.setAttribute('aria-expanded', 'true');
    dialogo.querySelector('#titulo-producao')?.focus();
}

function fecharProducao() {
    document.getElementById('form-producao')?.close();
}

function lerCampoProducao(formulario, nome) {
    const valor = new FormData(formulario).get(nome);
    return typeof valor === 'string' ? valor.trim() : '';
}

function persistirUsuarioProducao(usuario) {
    setmemoria('usuarioLogado', usuario);
    const usuarios = getmemoria('usuarios') || [];
    const indice = usuarios.findIndex(conta =>
        (usuario.email && conta.email === usuario.email)
        || (usuario.usuario && conta.usuario === usuario.usuario)
    );

    if (indice >= 0) usuarios[indice] = usuario;
    else usuarios.push(usuario);
    setmemoria('usuarios', usuarios);
}

function renderizarProducoes() {
    const lista = document.getElementById('lista-producoes');
    if (!lista) return;

    const usuario = getmemoria('usuarioLogado');
    const producoes = Array.isArray(usuario?.producoes) ? usuario.producoes : [];
    lista.innerHTML = producoes.map(producao => {
        const poster = typeof producao.poster === 'string' && /^https?:\/\//i.test(producao.poster)
            ? `<img src="${escaparTextoCartao(producao.poster)}" alt="Pôster de ${escaparTextoCartao(producao.titulo)}" loading="lazy">`
            : '<div class="poster-vazio" aria-hidden="true"><i class="fa-solid fa-film"></i></div>';
        const sinopse = producao.sinopse
            ? `<p>${escaparTextoCartao(producao.sinopse)}</p>`
            : '';

        return `
            <article class="producao-criada">
                ${poster}
                <div class="producao-criada-info">
                    <h3>${escaparTextoCartao(producao.titulo)}</h3>
                    <p>${escaparTextoCartao(producao.genero)} · ${escaparTextoCartao(producao.ano)}</p>
                    ${sinopse}
                </div>
            </article>
        `;
    }).join('');
}

function configurarFormularioProducao() {
    const dialogo = document.getElementById('form-producao');
    const formulario = document.getElementById('formulario-producao');
    if (!dialogo || !formulario) return;

    formulario.addEventListener('submit', evento => {
        evento.preventDefault();
        const usuario = getmemoria('usuarioLogado');
        if (!usuario) {
            window.location.href = 'login.html';
            return;
        }

        const titulo = lerCampoProducao(formulario, 'titulo');
        const genero = lerCampoProducao(formulario, 'genero');
        const ano = Number(lerCampoProducao(formulario, 'ano'));
        const sinopse = lerCampoProducao(formulario, 'sinopse');
        const poster = lerCampoProducao(formulario, 'poster');
        const mensagem = document.getElementById('mensagem-producao');

        if (!titulo || !genero || !Number.isInteger(ano)) {
            mensagem.textContent = 'Preencha o nome, o gênero e o ano do filme.';
            return;
        }

        if (!Array.isArray(usuario.producoes)) usuario.producoes = [];
        usuario.producoes.unshift({
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            titulo,
            genero,
            ano,
            sinopse,
            poster
        });

        persistirUsuarioProducao(usuario);
        renderizarProducoes();
        formulario.reset();
        mensagem.textContent = '';
        dialogo.close();
    });

    dialogo.addEventListener('close', () => {
        document.getElementById('botao-produtor')?.setAttribute('aria-expanded', 'false');
        document.getElementById('botao-produzir')?.setAttribute('aria-expanded', 'false');
    });

    dialogo.addEventListener('click', evento => {
        if (evento.target === dialogo) dialogo.close();
    });

    renderizarProducoes();
}

document.addEventListener('DOMContentLoaded', configurarFormularioProducao);
