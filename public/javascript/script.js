
const tira = document.querySelector('.carousel-tira');
const btnIzq = document.querySelector('.btn-izq');
const btnDer = document.querySelector('.btn-der');
let index = 0;

function mover() {
    tira.style.transform = `translateX(-${index * 33.333}%)`;
}

if (btnDer && btnIzq && tira) {
    btnDer.addEventListener('click', () => {
        index = (index < 2) ? index + 1 : 0;
        mover();
    });

    btnIzq.addEventListener('click', () => {
        index = (index > 0) ? index - 1 : 2;
        mover();
    });
    setInterval(() => {
        index = (index < 2) ? index + 1 : 0;
        mover();
    }, 6000);
}

const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');

if(menuToggle) {
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        menuToggle.classList.toggle('is-active'); 
    });
}

setInterval(() => {
    index = (index < 2) ? index + 1 : 0;
    mover();
}, 6000);