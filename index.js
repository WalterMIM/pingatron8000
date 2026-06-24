const express = require('express');
const path = require('path');
const session = require('express-session'); // Para las sesiones
const conexion = require('./conexion'); // Importa tu archivo de XAMPP
const app = express();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// ⚠️ REEMPLAZA ESTO CON TUS DATOS REALES DE GMAIL
const EMAIL_USER = 'tu_correo@gmail.com'; 
const EMAIL_PASS = 'abcd efgh ijkl mnop'; // Las 16 letras amarillas de Google sin espacios
const JWT_SECRET = 'MiClaveSecretaSuperSeguraParaCineCentral123';

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

// =========================================================================
// CAMBIO AQUÍ 🛠️: SE MODIFICÓ LA RUTA POST DE REGISTER PARA ENVIAR EL CORREO
// =========================================================================
app.post('/register', async (req, res) => {
    const { nombre, email, password } = req.body;

    try {
        // Primero verificamos localmente si el correo ya existe para no enviar correos en vano
        const queryCheck = 'SELECT id FROM usuarios WHERE email = ?';
        conexion.query(queryCheck, [email], async (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error al procesar el registro');
            }

            if (results.length > 0) {
                return res.send('<h3>El correo electrónico ya está registrado.</h3><a href="/register">Volver a intentar</a>');
            }

            // Guardamos los datos temporalmente dentro de un Token JWT que expira en 15 minutos
            const datosUsuario = { nombre, email, password };
            const token = jwt.sign(datosUsuario, JWT_SECRET, { expiresIn: '15m' });

            // Configuramos el motor de envíos de Gmail
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: EMAIL_USER,
                    pass: EMAIL_PASS
                }
            });

const host = req.get('host'); 
const protocol = req.protocol;
const urlVerificacion = `${protocol}://${host}/verificar?token=${token}`;

            const mailOptions = {
                from: EMAIL_USER,
                to: email,
                subject: '🎬 Confirma tu cuenta en CineCentral',
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                        <h2 style="color: #e50914;">¡Hola, ${nombre}!</h2>
                        <p>Gracias por unirte a <strong>CineCentral</strong>. Para activar tu cuenta y poder iniciar sesión, por favor haz clic en el siguiente botón:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${urlVerificacion}" style="background-color: #e50914; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Confirmar mi cuenta</a>
                        </div>
                        <p style="color: #666; font-size: 0.9em;">Este enlace expirará en 15 minutos por motivos de seguridad.</p>
                    </div>
                `
            };

            // Enviamos el correo electrónico real
            await transporter.sendMail(mailOptions);
            
            res.send('<h3>¡Casi listo!</h3><p>Hemos enviado un enlace de confirmación a tu correo electrónico. Por favor, revísalo para activar tu cuenta.</p>');
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Hubo un error al procesar tu registro.');
    }
});

// =========================================================================
// NUEVA RUTA AGREGADA 🛠️: AQUÍ CAE EL USUARIO CUANDO DA CLIC EN SU CORREO
// =========================================================================
app.get('/verificar', (req, res) => {
    const token = req.query.token;

    if (!token) {
        return res.status(400).send('Falta el token de verificación.');
    }

    try {
        // Desencriptamos y validamos el token.
        const usuarioValido = jwt.verify(token, JWT_SECRET);

        // Sacamos los datos que estaban en el limbo de los 15 minutos
        const { nombre, email, password } = usuarioValido;

        // ¡AQUÍ ES DONDE RECIÉN ENTRA A LA BASE DE DATOS!
        const query = 'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)';
        
        conexion.query(query, [nombre, email, password], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.send('<h3>Esta cuenta ya fue verificada o el correo ya existe.</h3>');
                }
                console.error(err);
                return res.status(500).send('Error al guardar el usuario en la base de datos.');
            }
            
            // Iniciamos la sesión en el servidor automáticamente como hacías antes
            req.session.usuarioId = result.insertId;
            req.session.nombre = nombre;
            req.session.rol = 'cliente';

            // Lo mandamos directo al inicio tal cual estaba en tu código anterior
            res.send(`
                <div style="text-align: center; font-family: sans-serif; margin-top: 50px;">
                    <h1 style="color: #4CAF50;">¡Cuenta verificada con éxito! 🎉</h1>
                    <p>Tu usuario ha sido creado correctamente. ¡Bienvenido a CineCentral!</p>
                    <p><a href="/" style="color: #e50914; font-weight: bold; text-decoration: none;">Ir a la Cartelera</a></p>
                </div>
            `);
        });

    } catch (error) {
        res.send(`
            <div style="text-align: center; font-family: sans-serif; margin-top: 50px;">
                <h1 style="color: #f44336;">El enlace ha expirado o es inválido ❌</h1>
                <p>Recuerda que por seguridad el enlace solo dura 15 minutos.</p>
                <p>Por favor, vuelve a la página de registro e inténtalo nuevamente.</p>
            </div>
        `);
    }
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
    console.log(`Servidor corriendo en el puerto: ${PORT}`);
});