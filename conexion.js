const mysql = require('mysql2');

const conexion = mysql.createConnection({
    // Tu host de Alwaysdata (revísalo en tu panel, suele ser este)
    host: 'mysql-cine.alwaysdata.net', 
    port: 3306,
    
    // Aquí van el usuario y la base de datos exactos con el prefijo de tu cuenta
    user: 'cine',      
    database: 'cine_base_datos', 
    
    // La contraseña que le asignaste al usuario de la BD en el panel
    password: 'cine12321**' 
});

conexion.connect((err) => {
    if (err) {
        console.error('Error conectando a Alwaysdata: ' + err.stack);
        return;
    }
    console.log('¡Conectado exitosamente a la base de datos en la NUBE (Alwaysdata)!');
});

module.exports = conexion;