/**
 * @file: ./app/services/fileService.js
 * @author: yin_gong<max.g.laboratory@gmail.com>
 */

const fs = require('fs');
const http = require('http');
const SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
const config = require(__dirname + '/../../env.js')['production'];

const speech_to_text = new SpeechToTextV1(config.WASTON);

const winston = require('winston');
winston.configure({
    transports: [
        new (winston.transports.File)({ filename: __dirname + '/../../app/log/' + 'speech_log.log' })
    ]
});

const File = {

    speechtotext: function (path, cb) {

        let params = {
            model: 'en-US_BroadbandModel',
            content_type: 'audio/flac',
            'interim_results': true,
            'max_alternatives': 3,
            'word_confidence': false,
            continuous: true,
            timestamps: true,
            silent: true
        };

        // Create the stream.
        let recognizeStream = speech_to_text.createRecognizeStream(params);

        // Pipe in the audio.
        fs.createReadStream(path).pipe(recognizeStream);

        // Pipe out the transcription to a file.
        recognizeStream.pipe(fs.createWriteStream(__dirname + '/../transcription/transcription.txt'));

        // Get strings instead of buffers from 'data' events.
        recognizeStream.setEncoding('utf8');

        // Listen for events.
        // recognizeStream.on('results', function (event) { onEvent('Results:', event); });
        recognizeStream.on('data', function (event) { onEvent('Data:', event); });
        recognizeStream.on('error', function (event) { onEvent('Error:', event); });
        recognizeStream.on('close', function (event) { onEvent('Close:', event); });
        recognizeStream.on('speaker_labels', function (event) { onEvent('Speaker_Labels:', event); });

        // Displays events on the console.
        function onEvent(name, event) {
            // console.log(name, JSON.stringify(event, null, 2));
            return cb(name, JSON.stringify(event, null, 2));
        };



    },

    convert: function (path, cb) {
        let exec = require('child_process').exec;
        let fromPath = path;
        let toPath = __dirname + '/../audios/' + fromPath.split('/')[fromPath.split('/').length - 1].split('.')[0] + '.flac';
        let command = 'ffmpeg -i "' + fromPath + '" -acodec flac -sample_fmt s16 -ar 16000 -ac 1 "' + toPath + '" -y';

        child = exec(command, function (err, stdout, stderr) {
            if (err !== null) {
                winston.error('exec error: ' + err);
            }

            //  let time=stderr.substring(stderr.lastIndexOf("Duration: ")+10,stderr.lastIndexOf(", start:"));
            cb(err, toPath);
        });
    },

    streamingMicRecognize: function (filename, encoding, sampleRateHertz, languageCode, cb) {

        // Imports the Google Cloud client library
        const speech = require('@google-cloud/speech');

        // Creates a client
        const client = new speech.SpeechClient();

        /**
         * TODO(developer): Uncomment the following lines before running the sample.
         */
        // const encoding = 'Encoding of the audio file, e.g. LINEAR16';
        // const sampleRateHertz = 16000;
        // const languageCode = 'BCP-47 language code, e.g. en-US';

        const request = {
            config: {
                encoding: encoding,
                sampleRateHertz: sampleRateHertz,
                languageCode: languageCode,
            },
            interimResults: false, // If you want interim results, set this to true
        };

        // Create a recognize stream
        const recognizeStream = client
            .streamingRecognize(request)
            .on('error', () => { 
                console.error
            })
            .on('data', data => {

                if(data.results.length > 0 && !data.results[0].alternatives[0].transcript){
                    return cb('Data:', data.results[0].alternatives[0].transcript);
                }else{
                    return cb('Data:', ' **** Google Service Down ****'); 
                }
                
            });

        fs.createReadStream(filename).pipe(recognizeStream);
        

    },

}

module.exports = File;