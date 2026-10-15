function selecionarPlano(evento) {
    const nomePlano = evento.currentTarget.dataset.plano;
    const planos = [
        { nome: 'Faísca', id: 'card-faisca' },
        { nome: 'Produtor', id: 'card-produtor' }
    ];

    planos.forEach(({ nome, id }) => {
        const card = document.getElementById(id);
        const button = card.querySelector('.botao-plano');
        const selecionado = nome === nomePlano;

        card.classList.toggle('selecionado', selecionado);
        button.setAttribute('aria-pressed', String(selecionado));
        button.querySelector('span').textContent = selecionado ? 'Selecionado' : 'Assinar';
        button.querySelector('i').className = selecionado
            ? 'fa-solid fa-check'
            : 'fa-solid fa-tag';
    });
}

document.querySelectorAll('.botao-plano').forEach((botao) => {
    botao.addEventListener('click', selecionarPlano);
});