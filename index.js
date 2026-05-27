<<<<<<< HEAD
const express = require('express');
const path = require('path');
const app = express();

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor en: http://localhost:${PORT}`);
});
=======

const http = require('http');
const express = require('express');
const app = express();

app.use(express.static(__dirname + '/'));
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.listen(4000);
console.log('Servidor en puerto 4000');
>>>>>>> e5570584487b126fc7b7f3fc3d421fd6abaf1115
