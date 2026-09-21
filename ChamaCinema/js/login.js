document.addEventListener('DOMContentLoaded', () =>{
    if(!getmemoria("usuarios")){
        fetch('../json/json_usuarios.json')
        .then(resposta => resposta.json())
        .then(usuariosJson =>{
            setmemoria("usuarios", usuariosJson);
        })
    }
})


function validarLogin(event) {
    event.preventDefault();

    const emailOuUsuario = document.getElementById('email-login').value.trim();
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
    else if(emailOuUsuario === 'usuario' && senha === '1234567'){
        window.location.href = 'index.html';
    }
    else {
        mostrarMensagem(mensagem, 'Este usuario não existe.');
    }

    let usuarios = getmemoria("usuarios");
    
    let achouUsuario = usuarios.find(
        u => (u.usuario === emailOuUsuario || u.email === emailOuUsuario) && u.senha === senha);


    if(!achouUsuario){
        mostrarMensagem(mensagem, "Ainda não existe um usuário com essas credenciais ou a senha está incorreta.");
        return false;
    }
  
    achouUsuario.logado = true;
    setmemoria("usuarios", usuarios);
    window.location.href = 'index.html';
    

    return true;
}

function mostrarMensagem(elemento, texto) {
    elemento.textContent = texto;
    elemento.classList.add('visivel');
}



