// Carrusel
const tira = document.querySelector('.carousel-tira');
const btnIzq = document.querySelector('.btn-izq');
const btnDer = document.querySelector('.btn-der');
let index = 0;

function mover() {
    tira.style.transform = `translateX(-${index * 33.333}%)`;
}

btnDer.addEventListener('click', () => {
    index = (index < 2) ? index + 1 : 0;
    mover();
});

btnIzq.addEventListener('click', () => {
    index = (index > 0) ? index - 1 : 2;
    mover();
});

// Menu Movil
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');

if(menuToggle) {
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
}

// Auto-play cada 6 segundos
setInterval(() => {
    index = (index < 2) ? index + 1 : 0;
    mover();
}, 6000);