
(function () {
    "use strict";

    function marcarOrigem(seletor, nomeOrigem) {
        var link = document.querySelector(seletor);
        if (!link) return;

        link.addEventListener("click", function () {
            sessionStorage.setItem("cc_origem_pagina", nomeOrigem);
        });
    }

    // Login -> Registro ("Cadastre-se")
    marcarOrigem("#login-main a#link-cadastro", "login");

    // Login -> Esqueci minha senha
    marcarOrigem("#login-main a#esqueci-senha", "login");

    // Registro -> Login ("Já tem uma conta? Login")
    marcarOrigem("#registro-main a#link-cadastro", "registro");

    // Esqueci minha senha -> Login ("Ou volte para o Login")
    marcarOrigem("#esqueci_senha-main a#link-cadastro", "esqueci_senha");
})();
