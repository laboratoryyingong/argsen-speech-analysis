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
const winston = require('winston');
winston.configure({
    transports: [
        new (winston.transports.File)({ filename: __dirname + '/app/log/' + 'speech_log.log' })
    ]
});

const config = require('./env.js')['production'];

const PORT = config.PORT;

const File = require('./app/services/fileService');

app.use("/components", express.static(__dirname + '/app/components'));  
app.use("/public", express.static(__dirname + '/app/public'));  

//todo: add pass 
app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/app/views/login.html');
});

app.get('/YXJnc2VuIHNwZWVjaCB0ZXN0', function(req, res,next) {  
    res.sendFile(__dirname + '/app/views/index.html');
});

httpServer.listen(PORT);
winston.info('Argsen Speech server on port : ' + PORT);

io.on('connection', function(client) { 
    
    var address = client.handshake.address;
    
    winston.info('Client connected... @ ' + js_yyyy_mm_dd_hh_mm_ss() + " IP Address : " + address);

    // client.on('join', function(data) {
    //     console.log(data);
    // });

    client.on('google-data', function(data){

        fs.writeFile(__dirname + '/app/audios/audio_blob_test.wav', data.blob, function(err) {
            if(err) return winston.error(err);

            File.convert(__dirname + '/app/audios/audio_blob_test.wav', function(err, filename){

                if(err) return winston.error(err);

                File.streamingMicRecognize(filename, 'FLAC', 16000, 'en-US', function(name, data){
                    switch (name) {
                        case 'Data:':
                            winston.info("new trascription from google API ... @ " + js_yyyy_mm_dd_hh_mm_ss() + " " + JSON.stringify(data))
                            io.emit('google-transcription', data);
                            break;
        
                        default:
                            break;
                    }
                })

            })
        })

    })

    client.on('waston-data', function(data){

        fs.writeFile(__dirname + '/app/audios/audio_blob_test.wav', data.blob, function (err) {
            if (err) return winston.error(err);

            File.convert(__dirname + '/app/audios/audio_blob_test.wav', function (err, path) {

                if (err) return winston.error(err);

                File.speechtotext(path, function (name, data) {
                    switch (name) {
                        case 'Data:':
                            winston.info("new trascription from IBM Waston ... @ " + js_yyyy_mm_dd_hh_mm_ss() + " " + data)
                            io.emit('waston-transcription', data);
                            break;

                        default:
                            break;
                    }
                });

            });

        });

    })

    client.on('disconnect', function(){ 
        winston.info('Client dis-connected... @ ' + js_yyyy_mm_dd_hh_mm_ss() + " IP Address : " + address)
    });

    client.on('argsen-login', function(data){
        if(data.account === 'admin' && data.password === 'speechtest'){
            winston.info('Client successfully login ... @ ' + js_yyyy_mm_dd_hh_mm_ss() + " IP Address : " + address)
            io.emit('argsen-login-statue', 'success');
        }

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

function log_yyyy_mm_dd_hh_mm_ss() {
    now = new Date();
    year = "" + now.getFullYear();
    month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
    day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
    hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
    minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
    second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
    return year + "_" + month + "_" + day + "_" + hour + "_" + minute + "_" + second;
}





