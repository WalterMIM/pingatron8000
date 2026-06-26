const tira = document.querySelector('.carousel-tira');
const btnIzq = document.querySelector('.btn-izq');
const btnDer = document.querySelector('.btn-der');
let index = 0;
let autoMover; // Variable para controlar el temporizador

function mover() {
    // 🎯 SOLUCIÓN AL DESAJUSTE: Ahora multiplicamos por 100%. 
    // Gracias al CSS 'width: 100%; flex-shrink: 0;', cada imagen ocupa exactamente todo el ancho disponible.
    if (tira) {
        tira.style.transform = `translateX(-${index * 100}%)`;
    }
}

// Creamos una función global para que index.html pueda reiniciar el conteo al cargar la BD
function inicializarCarrusel() {
    const imagenes = document.querySelectorAll('.carousel-tira img');
    const totalImagenes = imagenes.length;

    if (totalImagenes === 0 || !tira) return;

    // BOTÓN DERECHO
    if (btnDer) {
        btnDer.onclick = () => {
            index = (index < totalImagenes - 1) ? index + 1 : 0;
            mover();
            reiniciarTemporizador(totalImagenes); // Resetea el tiempo para que no salte de golpe al hacer clic
        };
    }

    // BOTÓN IZQUIERDO
    if (btnIzq) {
        btnIzq.onclick = () => {
            index = (index > 0) ? index - 1 : totalImagenes - 1;
            mover();
            reiniciarTemporizador(totalImagenes);
        };
    }

    // Iniciar temporizador automático inteligente
    reiniciarTemporizador(totalImagenes);
}

function reiniciarTemporizador(total) {
    clearInterval(autoMover); // Borra el temporizador anterior
    autoMover = setInterval(() => {
        index = (index < total - 1) ? index + 1 : 0;
        mover();
    }, 6000); // Gira automáticamente cada 6 segundos
}

// 📱 MENÚ LATERAL (Se queda exactamente igual como lo tenías)
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');

if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        menuToggle.classList.toggle('is-active'); 
    });
}

// Si la página carga imágenes estáticas por defecto, lo arranca al inicio
document.addEventListener('DOMContentLoaded', () => {
    inicializarCarrusel();
});