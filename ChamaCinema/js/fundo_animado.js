const duracaoFundo = 24000;
const chaveInicioFundo = 'chamacinema-fundo-inicio';

let inicioFundo = sessionStorage.getItem(chaveInicioFundo);

if (!inicioFundo) {
    inicioFundo = Date.now().toString();
    sessionStorage.setItem(chaveInicioFundo, inicioFundo);
}

const tempoDecorrido = Date.now() - Number(inicioFundo);
const atrasoFundo = -(tempoDecorrido % duracaoFundo);

document.documentElement.style.setProperty('--fundo-delay', `${atrasoFundo}ms`);