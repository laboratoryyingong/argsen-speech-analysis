/**
 * @file: ./app/services/fileService.js
 * @author: yin_gong<max.g.laboratory@gmail.com>
 */

const fs = require('fs');
const http = require('http');
const SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');

const speech_to_text = new SpeechToTextV1({
    username: '918aba83-56e2-4a52-9917-af9ad033dc7d',
    password: 'dgbaLilkg0lC'
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
            console.log('exec error: ' + err);
          }
    
        //  let time=stderr.substring(stderr.lastIndexOf("Duration: ")+10,stderr.lastIndexOf(", start:"));
          cb(err, toPath);
        });
      },


}

module.exports = File;