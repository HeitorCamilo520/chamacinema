
function validarLogin(event) {
    event.preventDefault();

    const emailOuUsuario = document.getElementById('email-login').value;
    emailOuUsuario.trim();
    const senha = document.getElementById('senha-login').value;
    const mensagem = document.getElementById('mensagem-login');

    mensagem.textContent = '';
    mensagem.classList.remove('visivel');

    if (emailOuUsuario == "") {
        mostrarMensagem(mensagem, 'Por favor, preencha o campo de e-mail ou usuário.');
        return false;
    }

    if (senha == "") {
        mostrarMensagem(mensagem, 'Por favor, preencha o campo de senha.');
        return false;
    }

    
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

    fetch('../json/json_usuarios.json')
    .then(resposta => resposta.json())
    .then(usuariosJson => {
        setmemoria(usuariosJson);
            
        let VetUsuarios = getmemoria("usuarios");
        VetUsuarios = JSON.parse(VetUsuarios);
        alert(usuariosJson);
        alert(VetUsuarios);
        let existe = false;

        for (const element of usuariosJson) {
            if (element.usuario === emailOuUsuario || element.email === emailOuUsuario){
                existe = true;
                element.logado = true;
                setmemoria(usuariosJson);
                window.location.href = 'index.html';
            }

        }

        if(!existe){
            mostrarMensagem(mensagem, 'Este usuario não existe.');
            return false;
        }
    })

    return true;
}

function mostrarMensagem(elemento, texto) {
    elemento.textContent = texto;
    elemento.classList.add('visivel');
}
