const mysql = require('mysql2');

const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',      
    password: '',      
    database: 'cine_central' 
});

conexion.connect((err) => {
    if (err) {
        console.error('Error conectando a MySQL: ' + err.stack);
        return;
    }
    console.log('¡Conectado exitosamente a la base de datos de XAMPP!');
});

module.exports = conexion;