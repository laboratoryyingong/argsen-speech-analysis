/**
 * @file: ./app/public/js/index.js
 * @author: yin_gong<max.g.laboratory@gmail.com>
 */
var socket = io.connect('http://localhost:3999');
var state = false;

if (!window.jQuery) {
    var script = document.createElement('script');
    script.type = "text/javascript";
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js";
    document.getElementsByTagName('head')[0].appendChild(script);
}

var mediaConstraints = {
    audio: true
};

$("#clear_record").on("click", function(){
    $('#Message').val('');
})

navigator.getUserMedia(mediaConstraints, onMediaSuccess, onMediaError);

//socket
socket.on('transcription', function(data){
    var string = data.replace(/[^\w\s]/gi, '');
    var $Message = $('#Message');
    var previous_message = $Message.val();
    $Message.val(previous_message + string);
})

function onMediaSuccess(stream) {
    var mediaRecorder = new MediaStreamRecorder(stream);
    mediaRecorder.mimeType = 'audio/wav'; // check this line for audio/wav
    mediaRecorder.ondataavailable = function (blob) {
        // POST/PUT "Blob" using FormData/XHR2
        // var blobURL = URL.createObjectURL(blob);
        // console.log(blobURL);
        socket.emit('data', {
            "blob": blob
        });
    };

    var $start_to_record = $('#start_to_record');

    $start_to_record.on("click", function(){
        
        if(state){
            mediaRecorder.stop();
            state = false;
            var $start_to_record = $('#start_to_record');
            $start_to_record.empty();
            $start_to_record.toggleClass('button-primary button-red');
            $start_to_record.text('Start Record & Output text ');
            $start_to_record.append('<i class="fa fa-play" aria-hidden="true"></i>');

        }else{
            mediaRecorder.start(3000);
            state = true;
            var $start_to_record = $('#start_to_record');
            $start_to_record.empty();
            $start_to_record.toggleClass('button-primary button-red');
            $start_to_record.text('Recording ... ');
            $start_to_record.append('<i class="fa fa-microphone" aria-hidden="true"></i>');
        }

        
    })

}

function onMediaError(e) {
    console.error('media error', e);
}