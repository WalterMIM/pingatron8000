
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
