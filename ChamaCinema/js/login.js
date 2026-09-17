function validarLogin(event) {
    event.preventDefault();

    const emailOuUsuario = document.getElementById('email-login').value.trim();
    const senha = document.getElementById('senha-login').value;
    const mensagem = document.getElementById('mensagem-login');

    mensagem.textContent = '';
    mensagem.classList.remove('visivel');

    if (!emailOuUsuario) {
        mostrarMensagem(mensagem, 'Por favor, preencha o campo de e-mail ou usuário.');
        return false;
    }

    if (!senha) {
        mostrarMensagem(mensagem, 'Por favor, preencha o campo de senha.');
        return false;
    }

    if(emailOuUsuario === 'produtor' && senha === '1234567'){
        window.location.href = 'produtor.html';


    }
    else if(emailOuUsuario === 'admin' && senha === '1234567'){
        window.location.href = 'admin.html';

    }
    else{
        window.location.href = 'index.html';

    }

    return true;
}

function mostrarMensagem(elemento, texto) {
    elemento.textContent = texto;
    elemento.classList.add('visivel');
}
