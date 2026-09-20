
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
    else{
        window.location.href = 'index.html';

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

        for (let i = 0; i < usuariosJson.length; i++) {
            if (usuariosJson[i].usuario === emailOuUsuario || usuariosJson[i].email === emailOuUsuario){
                existe = true;
                usuariosJson[i].logado = true;
            }
        }

        if(!existe){
            mostrarMensagem(mensagem, "Ainda não existe uma conta com este nome de usuário ou email");
            return false;
        }
        else {
            setmemoria(usuariosJson);
            window.location.href = 'index.html';
        }
    })

    return true;
}

function mostrarMensagem(elemento, texto) {
    alert(texto);
    elemento.textContent = texto;
    elemento.classList.add('visivel');
}
