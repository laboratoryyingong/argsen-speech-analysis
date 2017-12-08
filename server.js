/**
 * argsen speech analysis 
 * @author yin_gong<max.g.laboratory@gmail.com>
 */

const fs = require('fs');
const express = require('express');
const app = express();
const https = require('https');
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);

const chalk = require('chalk');
const log = console.log;

const config = require('./env.js')['development'];

const PORT = config.PORT;

const File = require('./app/services/fileService');

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

    client.on('data', function(data){
  
        fs.writeFile(__dirname + '/app/audios/audio_blob_test.wav', data.blob, function(err) {
            if(err) return console.log(err);

            File.convert(__dirname + '/app/audios/audio_blob_test.wav', function(err, path){

                if(err) return console.log(err);

                File.speechtotext(path, function(name, data){
                    switch (name) {
                        case 'Data:':
                            log(chalk.yellow("new trascription is sending to client ... @ " + js_yyyy_mm_dd_hh_mm_ss()))
                            io.emit('transcription', data);
                            break;
                    
                        default:
                            break;
                    }
                });

            });
        
        });

    })

});

function js_yyyy_mm_dd_hh_mm_ss() {
    now = new Date();
    year = "" + now.getFullYear();
    month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
    day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
    hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
    minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
    second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
    return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
}





