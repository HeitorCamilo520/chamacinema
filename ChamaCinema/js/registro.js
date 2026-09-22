function validarFormulario(event) {
    event.preventDefault(); 

    const usuario = document.getElementById('usuario-registro').value.trim();
    const email = document.getElementById('email-registro').value.trim();
    const senha = document.getElementById('senha-registro').value;
    const confirmarSenha = document.getElementById('confirmar-senha-registro').value;
    const mensagem = document.getElementById('mensagem-registro');


    //alert(usuario + " " + email + " " + senha + " " + confirmarSenha);


    mensagem.textContent = '';
    mensagem.classList.remove('visivel');

    if (usuario == "" || email == "" || senha == "" || confirmarSenha == "") {
        mostrarMensagem(mensagem, 'Por favor, preencha todos os campos.');
        return false;
    }

    if (senha != confirmarSenha) {
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
        alert(usuariosJson);

        let existe = false;

        for (const element of usuariosJson) {
            if (element.usuario === usuario || element.email === email){
                existe = true;
            }
        }

        if(existe){
            mostrarMensagem(mensagem, "Já existe uma conta com este nome de usuário ou email");
        }
        else{
            novoUsuario = {
                    "usuario":usuario,
                    "email":email,
                    "senha":senha,
                    "nacionalidade":null,
                    "linkFoto": null,
                    "dataNasc":null,
                    "preferencias":[],
                    "logado" : true
                }

                usuariosJson.push(novoUsuario);

                setmemoria(usuariosJson);

                window.location.href = 'preferencias.html';

        }
    } )
    
    return true;
}

function mostrarMensagem(elemento, texto) {
    elemento.textContent = texto;
    elemento.classList.add('visivel');
}

function mostrarSenha(a) {

    if (a == 1){
    const senhaInput = document.getElementById('senha-registro1');
    const mostrarSenha = document.getElementById('mostrar-senha1');

        if (senhaInput.type == 'text') {
            mostrarSenha.innerHTML = '<i class="fa-solid fa-eye icone-olho-confirmar" onclick="mostrarSenha(1)"></i>';
            senhaInput.type = 'password';
        }
        else {
            mostrarSenha.innerHTML = '<i class="fa-solid fa-eye-slash icone-olho-confirmar" onclick="mostrarSenha(1)"></i>';
            senhaInput.type = 'text';
        }

    }

    if (a == 2){
        const senhaInput = document.getElementById('senha-registro2');
        const mostrarSenha = document.getElementById('mostrar-senha2');
    
        if (senhaInput.type == 'text') {
            mostrarSenha.innerHTML = '<i class="fa-solid fa-eye icone-olho-confirmar" onclick="mostrarSenha(2)"></i>';
            senhaInput.type = 'password';
        }
        else {
            mostrarSenha.innerHTML = '<i class="fa-solid fa-eye-slash icone-olho-confirmar" onclick="mostrarSenha(2)"></i>';
            senhaInput.type = 'text';
        }
        }

}