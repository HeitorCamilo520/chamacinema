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

    let usuarios = getmemoria("usuarios");
    
    let achouUsuario = usuarios.find(
        u => (u.usuario === emailOuUsuario || u.email === emailOuUsuario) && u.senha === senha);


    if(!achouUsuario){
        mostrarMensagem(mensagem, "Ainda não existe um usuário com essas credenciais ou a senha está incorreta.");
        return false;
    }
  
    achouUsuario.logado = true;
    setmemoria("usuarios", usuarios);
    setmemoria("usuarioLogado", achouUsuario);
    
   window.location.href = 'index.html';

    return true;
}

function mostrarMensagem(elemento, texto) {
    elemento.textContent = texto;
    elemento.classList.add('visivel');
}

function mostrarSenha() {
    const senhaInput = document.getElementById('senha-login');
    const mostrarSenha = document.getElementById('mostrar-senha');

    if (senhaInput.type == 'text') {
        mostrarSenha.innerHTML = '<i class="fa-solid fa-eye" id="icone-olho" onclick="mostrarSenha()"></i>';
        senhaInput.type = 'password';
    }
    else {
        mostrarSenha.innerHTML = '<i class="fa-solid fa-eye-slash" id="icone-olho" onclick="mostrarSenha()"></i>';
        senhaInput.type = 'text';
    }
}


