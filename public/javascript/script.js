/**
 * SELECTORES PARA EL CARRUSEL
 */
const tira = document.querySelector('.carrusel-fotos');
const btnIzq = document.querySelector('.btn-izq');
const btnDer = document.querySelector('.btn-der');

/**
 * SELECTORES PARA EL MENÚ MÓVIL
 */
const menuToggle = document.getElementById('mobile-menu');
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');

// Variables de estado
let posicion = 0; // 0, 1, 2
let intervalo;

// ==========================================
// 1. FUNCIONES DEL CARRUSEL
// ==========================================

function actualizarMovimiento() {
    // Calculamos el porcentaje: 100 dividido entre 3 fotos = 33.33% cada una
    const desplazamiento = posicion * (100 / 3);
    tira.style.transform = `translateX(-${desplazamiento}%)`;
}

function irSiguiente() {
    if (posicion < 2) {
        posicion++;
    } else {
        posicion = 0; // Vuelve al inicio
    }
    actualizarMovimiento();
}

function irAnterior() {
    if (posicion > 0) {
        posicion--;
    } else {
        posicion = 2; // Va a la última
    }
    actualizarMovimiento();
}

// Control del tiempo automático
function iniciarAuto() {
    intervalo = setInterval(irSiguiente, 5000); // Cambia cada 5 segundos
}

function resetReloj() {
    clearInterval(intervalo);
    iniciarAuto();
}

// Eventos de botones carrusel
btnDer.addEventListener('click', () => {
    irSiguiente();
    resetReloj();
});

btnIzq.addEventListener('click', () => {
    irAnterior();
    resetReloj();
});


// ==========================================
// 2. FUNCIONES DEL MENÚ MÓVIL
// ==========================================

// Abrir/Cerrar menú al tocar la hamburguesa
menuToggle.addEventListener('click', () => {
    navbar.classList.toggle('active');
    
    // Opcional: Animación del botón hamburguesa
    menuToggle.classList.toggle('is-active'); 
});

// Cerrar el menú automáticamente cuando se hace click en un enlace
// (Muy útil en móviles para que no se quede el menú tapando la pantalla)
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navbar.classList.remove('active');
    });
});

// Cerrar menú si se hace click fuera del menú (en el área principal)
document.addEventListener('click', (event) => {
    const clickAdentro = navbar.contains(event.target) || menuToggle.contains(event.target);
    
    if (!clickAdentro && navbar.classList.contains('active')) {
        navbar.classList.remove('active');
    }
});


// ==========================================
// 3. INICIALIZACIÓN
// ==========================================
iniciarAuto();