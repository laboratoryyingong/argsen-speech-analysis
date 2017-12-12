/**
 * @file: ./app/public/js/index.js
 * @author: yin_gong<max.g.laboratory@gmail.com>
 */

var server_url = 'http://localhost:8080';
var socket = io.connect(server_url);
var wastonState = false;
var googleState = false;

if (!window.jQuery) {
    var script = document.createElement('script');
    script.type = "text/javascript";
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js";
    document.getElementsByTagName('head')[0].appendChild(script);
}

var mediaConstraints = {
    audio: true
};

$("#clear_record_waston").on("click", function(){
    $('#Message_waston').val('');
})

$("#clear_record_google").on("click", function(){
    $('#Message_google').val('');
})

navigator.getUserMedia(mediaConstraints, onMediaSuccess, onMediaError);

//socket
socket.on('waston-transcription', function(data){
    var string = data.replace(/[^\w\s]/gi, '');
    var $Message_waston = $('#Message_waston');
    var previous_message = $Message_waston.val();
    $Message_waston.val(previous_message + string);
})

socket.on('google-transcription', function(data){
    var string = data.replace(/[^\w\s]/gi, '');
    var $Message_google = $('#Message_google');
    var previous_message = $Message_google.val();
    $Message_google.val(previous_message + string);
})

function onMediaSuccess(stream) {

    /**
     * stream to waston
     */

    var wastonMediaRecorder = new MediaStreamRecorder(stream);
    wastonMediaRecorder.mimeType = 'audio/wav'; // check this line for audio/wav
    wastonMediaRecorder.ondataavailable = function (blob) {
        socket.emit('waston-data', {
            "blob": blob
        });
    };

    var $start_to_record_waston = $('#start_to_record_waston');

    $start_to_record_waston.on("click", function(){
        
        if(wastonState){
            wastonMediaRecorder.stop();
            wastonState = false;
            var $start_to_record_waston = $('#start_to_record_waston');
            $start_to_record_waston.empty();
            $start_to_record_waston.toggleClass('button-waston button-red');
            $start_to_record_waston.text('Start Record & Output text ');
            $start_to_record_waston.append('<i class="fa fa-play" aria-hidden="true"></i>');

        }else{
            wastonMediaRecorder.start(1500);
            wastonState = true;
            var $start_to_record_waston = $('#start_to_record_waston');
            $start_to_record_waston.empty();
            $start_to_record_waston.toggleClass('button-waston button-red');
            $start_to_record_waston.text('Recording ... ');
            $start_to_record_waston.append('<i class="fa fa-microphone" aria-hidden="true"></i>');
        }

        
    })

    /**
     * stream to google
     */

    var googleMediaRecorder = new MediaStreamRecorder(stream);
    googleMediaRecorder.mimeType = 'audio/pcm'; // check this line for audio/wav
    googleMediaRecorder.ondataavailable = function (blob) {
        socket.emit('google-data', {
            "blob": blob
        });
    };

    var $start_to_record_google = $('#start_to_record_google');

    $start_to_record_google.on("click", function(){
        
        if(googleState){
            googleMediaRecorder.stop();
            googleState = false;
            var $start_to_record_google = $('#start_to_record_google');
            $start_to_record_google.empty();
            $start_to_record_google.toggleClass('button-blue button-red');
            $start_to_record_google.text('Start Record & Output text ');
            $start_to_record_google.append('<i class="fa fa-play" aria-hidden="true"></i>');

        }else{
            googleMediaRecorder.start(1500);
            googleState = true;
            var $start_to_record_google = $('#start_to_record_google');
            $start_to_record_google.empty();
            $start_to_record_google.toggleClass('button-blue button-red');
            $start_to_record_google.text('Recording ... ');
            $start_to_record_google.append('<i class="fa fa-microphone" aria-hidden="true"></i>');
        }

    })


}

function onMediaError(e) {
    console.error('media error', e);
}