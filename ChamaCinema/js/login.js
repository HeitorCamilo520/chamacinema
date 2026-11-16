let usuariosLoginPromise;

function lerUsuariosSalvos() {
    try {
        const usuarios = getmemoria('usuarios');
        return Array.isArray(usuarios) ? usuarios : [];
    } catch {
        return [];
    }
}

async function buscarUsuariosBase() {
    const resposta = await fetch('../json/json_usuarios.json');
    if (!resposta.ok) throw new Error('Não foi possível carregar as contas.');
    const usuarios = await resposta.json();
    if (!Array.isArray(usuarios)) throw new Error('A lista de contas está inválida.');
    return usuarios;
}

function combinarUsuarios(usuariosSalvos, usuariosBase) {
    const usuarios = [...usuariosSalvos];

    usuariosBase.forEach(usuarioBase => {
        const indice = usuarios.findIndex(usuario =>
            usuario.usuario === usuarioBase.usuario || usuario.email === usuarioBase.email
            || usuario.__adminIdentidadeOriginal?.usuario === usuarioBase.usuario
            || usuario.__adminIdentidadeOriginal?.email === usuarioBase.email
        );
        if (indice < 0) usuarios.push(usuarioBase);
        else {
            usuarios[indice].senha = usuarioBase.senha;
            if (usuarioBase.plano && !usuarios[indice].__adminIdentidadeOriginal) {
                usuarios[indice].plano = usuarioBase.plano;
            }
        }
    });

    setmemoria('usuarios', usuarios);
    return usuarios;
}

function carregarUsuariosLogin() {
    if (!usuariosLoginPromise) {
        usuariosLoginPromise = (async () => {
            const usuariosSalvos = lerUsuariosSalvos();
            try {
                return combinarUsuarios(usuariosSalvos, await buscarUsuariosBase());
            } catch (error_) {
                if (usuariosSalvos.length) return usuariosSalvos;
                throw error_;
            }
        })().catch(error_ => {
            usuariosLoginPromise = null;
            throw error_;
        });
    }

    return usuariosLoginPromise;
}

document.addEventListener('DOMContentLoaded', () => {
    carregarUsuariosLogin().catch(error_ => console.error(error_));
});


async function validarLogin(event) {
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

    let usuarios;
    try {
        usuarios = await carregarUsuariosLogin();
    } catch {
        mostrarMensagem(mensagem, 'Não foi possível carregar as contas. Tente novamente.');
        return false;
    }

    const identificador = emailOuUsuario.toLocaleLowerCase('pt-BR');
    let achouUsuario = usuarios.find(usuario =>
        (usuario.usuario.toLocaleLowerCase('pt-BR') === identificador
            || usuario.email.toLocaleLowerCase('pt-BR') === identificador)
        && usuario.senha === senha
    );

    if (!achouUsuario) {
        try {
            usuarios = combinarUsuarios(usuarios, await buscarUsuariosBase());
            achouUsuario = usuarios.find(usuario =>
                (usuario.usuario.toLocaleLowerCase('pt-BR') === identificador
                    || usuario.email.toLocaleLowerCase('pt-BR') === identificador)
                && usuario.senha === senha
            );
        } catch (error_) {
            console.error(error_);
        }
    }


    if(!achouUsuario){
        mostrarMensagem(mensagem, "Ainda não existe um usuário com essas credenciais ou a senha está incorreta.");
        return false;
    }
  
    usuarios.forEach(usuario => {
        usuario.logado = usuario === achouUsuario;
    });
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

document.querySelector('#registro-main2')?.addEventListener('click', () => window.location.href = 'registro.html');
