// MENU LATERAL
const menuBtn = document.getElementById('menuBtn');
const sidebar = document.getElementById('sidebar');

menuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

// CARRUSEL
const tira = document.querySelector('.carrusel-fotos');
const btns = document.querySelectorAll('.btn-nav');
let pos = 0;

function mover(direccion) {
    if (direccion === 'der') {
        pos = (pos < 2) ? pos + 1 : 0;
    } else {
        pos = (pos > 0) ? pos - 1 : 2;
    }
    tira.style.transform = `translateX(-${pos * 33.333}%)`;
}

document.querySelector('.btn-der').addEventListener('click', () => mover('der'));
document.querySelector('.btn-izq').addEventListener('click', () => mover('izq'));

// Auto-play
setInterval(() => mover('der'), 5000);