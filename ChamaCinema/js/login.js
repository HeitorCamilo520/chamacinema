function validarFormulario(event) {
    event.preventDefault(); 

    const usuario = document.getElementById('usuario-registro').value.trim();
    const email = document.getElementById('email-registro').value.trim();
    const senha = document.getElementById('senha-registro').value;
    const confirmarSenha = document.getElementById('confirmar-senha-registro').value;
    const mensagem = document.getElementById('mensagem-registro');

    mensagem.textContent = '';
    mensagem.classList.remove('visivel');

    if (!usuario || !email || !senha || !confirmarSenha) {
        mostrarMensagem(mensagem, 'Por favor, preencha todos os campos.');
        return false;
    }

    if (senha !== confirmarSenha) {
        mostrarMensagem(mensagem, 'As senhas não coincidem.');
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        mostrarMensagem(mensagem, 'Por favor, insira um e-mail válido.');
        return false;
    }

    fetch('../json/json_usuarios.json')
    .then(resposta => resposta.json())
    .then(usuariosJson => {
        for (let i = 0; i < usuariosJson.length; i++) {
            if ((usuariosJson[i].usuario === usuario || usuariosJson[i].email === email)){
                mostrarMensagem(mensagem, "Já existe uma conta com este nome de usuário ou email");
            }

            else{
                novoUsuario = {
                    "usuario":usuario,
                    "email":email,
                    "senha":senha,
                    "nacionalidade":null,
                    "linkFoto": null,
                    "dataNasc":null
                }
                usuariosJson.push(novoUsuario);


            }
            
        }

    })

    // Se tudo estiver correto, redireciona para a próxima página
    window.location.href = 'preferencias.html';
    return true;
}

function mostrarMensagem(elemento, texto) {
    elemento.textContent = texto;
    elemento.classList.add('visivel');
}
