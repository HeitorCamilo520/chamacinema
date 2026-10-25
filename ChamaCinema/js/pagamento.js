const botoesPagamento = document.querySelectorAll('.opcoes-pagamento');
const formularioCartao = document.querySelector('#form-cartao');
const conteudoPix = document.querySelector('#conteudo-pix');
const cabecalhoFormaPagamento = document.querySelector('.cabecalho-forma');
const tituloFormaPagamento = document.querySelector('#titulo-forma-pagamento');
const mensagemPagamento = document.querySelector('#mensagem-pagamento');

botoesPagamento.forEach((botao) => {
    botao.addEventListener('click', () => {
        const metodo = botao.id;
        botoesPagamento.forEach((opcao) => opcao.classList.add('sem-transicao'));
        const nomesMetodos = {
            pix: 'Pix',
            debito: 'Cartão de débito',
            credito: 'Cartão de crédito'
        };

        botoesPagamento.forEach((opcao) => {
            const ativo = opcao === botao;
            opcao.classList.toggle('selecionado', ativo);
            opcao.setAttribute('aria-pressed', String(ativo));
        });

        tituloFormaPagamento.textContent = nomesMetodos[metodo];
        formularioCartao.hidden = metodo === 'pix';
        conteudoPix.hidden = metodo !== 'pix';
        mensagemPagamento.hidden = true;

        const painelAtivo = metodo === 'pix' ? conteudoPix : formularioCartao;
        cabecalhoFormaPagamento.classList.remove('transicao-metodo');
        formularioCartao.classList.remove('transicao-metodo');
        conteudoPix.classList.remove('transicao-metodo');
        requestAnimationFrame(() => {
            botoesPagamento.forEach((opcao) => opcao.classList.remove('sem-transicao'));
            if (painelAtivo.hidden) return;
            cabecalhoFormaPagamento.classList.add('transicao-metodo');
            painelAtivo.classList.add('transicao-metodo');
        });
    });
});

formularioCartao.addEventListener('submit', (evento) => {
    evento.preventDefault();
    mensagemPagamento.hidden = false;
});