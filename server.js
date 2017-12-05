/**
 * argsen speech analysis 
 * @author yin_gong<max.g.laboratory@gmail.com>
 */

const express = require('express');
const app = express();
const https = require('https');
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);

const chalk = require('chalk');
const log = console.log;

const config = require('./env.js')['development'];

const PORT = config.PORT;

app.use("/components", express.static(__dirname + '/app/components'));  
app.use("/public", express.static(__dirname + '/app/public'));  
app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/app/views/index.html');
});

httpServer.listen(PORT);
log(chalk.white('Argsen Speech server on port : ' + PORT));

io.on('connection', function(client) {  
    console.log('Client connected...');

    client.on('join', function(data) {
        console.log(data);
    });

});