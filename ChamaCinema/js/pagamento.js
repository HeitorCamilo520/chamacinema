function pix() {
    document.querySelector(".form-pagamento").style.transform = `translateY(200%)`;
    document.querySelector(".form-pagamento2").style.transform = `translateY(-100%)`;
}

function debito() {
    document.querySelector(".form-pagamento").style.transform = `translateY(00%)`;
    document.querySelector(".form-pagamento2").style.transform = `translateY(200%)`;
}

function credito() {
    document.querySelector(".form-pagamento").style.transform = `translateY(00%)`;
    document.querySelector(".form-pagamento2").style.transform = `translateY(200%)`;
}

document.querySelector('#pix')?.addEventListener('click', () => pix());
document.querySelector('#debito')?.addEventListener('click', () => debito());
document.querySelector('#credito')?.addEventListener('click', () => credito());