
(function () {

    function marcarOrigem(seletor, nomeOrigem) {
        var link = document.querySelector(seletor);
        if (!link) return;

        link.addEventListener("click", function () {
            sessionStorage.setItem("cc_origem_pagina", nomeOrigem);
        });
    }

    marcarOrigem("#login-main a#link-cadastro", "login");

    marcarOrigem("#login-main a#esqueci-senha", "login");

    marcarOrigem("#registro-main a#link-cadastro", "registro");

    marcarOrigem("#esqueci_senha-main a#link-cadastro", "esqueci_senha");
})();
