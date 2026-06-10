const express = require('express');
const path = require('path');
const session = require('express-session'); // Para las sesiones
const conexion = require('./conexion'); // Importa tu archivo de XAMPP
const app = express();

// 1. CONFIGURACIONES GENERALES
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

// Permite que Express lea los datos que envías desde el formulario HTML
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuración de la sesión en memoria
app.use(session({
    secret: 'ClaveSecretaDelCineCentral',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // false porque estamos trabajando en localhost
}));

// 2. RUTAS DE NAVEGACIÓN (GET)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'Login.html'));
});



app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'Register.html'));
});


// 3. RUTA DEL LOGIN PARA PROCESAR EL FORMULARIO (POST)
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Buscamos al usuario en la tabla de XAMPP
    const query = 'SELECT id, nombre, email, rol FROM usuarios WHERE email = ? AND password = ?';
    
    conexion.query(query, [email, password], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error interno en el servidor');
        }

        // Si encontramos una coincidencia
        if (results.length > 0) {
            const usuario = results[0];
            
            // Guardamos los datos en la sesión para que el servidor lo recuerde
            req.session.usuarioId = usuario.id;
            req.session.nombre = usuario.nombre;
            req.session.rol = usuario.rol;

            // Redirige al inicio tal cual está la página actualmente
            res.redirect('/'); 
            
        } else {
            // Si los datos no coinciden en phpMyAdmin
            res.send('<h3>Correo o contraseña incorrectos.</h3><a href="/login">Volver a intentar</a>');
        }
    });
});

// Ruta POST para procesar el formulario de Registro
app.post('/register', (req, res) => {
    const { nombre, email, password } = req.body;

    // Insertamos el nuevo usuario en la tabla de XAMPP
    // El rol por defecto será 'cliente' automáticamente gracias al SQL que ejecutamos antes
    const query = 'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)';
    
    conexion.query(query, [nombre, email, password], (err, result) => {
        if (err) {
            // Si el correo ya existe, MySQL arrojará un error por la propiedad UNIQUE
            if (err.code === 'ER_DUP_ENTRY') {
                return res.send('<h3>El correo electrónico ya está registrado.</h3><a href="/register">Volver a intentar</a>');
            }
            console.error(err);
            return res.status(500).send('Error al registrar el usuario');
        }

        // Si se guardó con éxito, iniciamos su sesión automáticamente
        req.session.usuarioId = result.insertId; // El ID que MySQL le asignó
        req.session.nombre = nombre;
        req.session.rol = 'cliente'; // Al registrarse por la web, siempre es cliente

        // Lo mandamos directo al inicio tal cual querías
        res.redirect('/');
    });
});


// Ruta para que el Frontend sepa si hay un usuario activo
app.get('/api/usuario-actual', (req, res) => {
    if (req.session && req.session.nombre) {
        res.json({
            logueado: true,
            nombre: req.session.nombre,
            rol: req.session.rol
        });
    } else {
        res.json({ logueado: false });
    }
});

// Ruta para Cerrar Sesión
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/'); // Al cerrar sesión, regresa al inicio
    });
});

// 4. ENCENDIDO DEL SERVIDOR
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor en: http://localhost:${PORT}`);
});