/**
 * @file: ./app/public/js/login.js
 * @author: yin_gong<max.g.laboratory@gmail.com>
 */

var env = ENV.development

var server_url = env.server_url;

var socket = io.connect(server_url);

if (!window.jQuery) {
    var script = document.createElement('script');
    script.type = "text/javascript";
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js";
    document.getElementsByTagName('head')[0].appendChild(script);
}

var $login = $("#login");

socket.on('argsen-login-statue', function(message){

    if(message === 'success'){
        window.location.href = "/YXJnc2VuIHNwZWVjaCB0ZXN0";
    }

})

$login.on("click", function(){
    var $account = $("#account");
    var $password = $("#password");

    if($account.val().trim().length === 0){
        $account.addClass("error");
    }else{
        $account.removeClass("error");
    }
    
    if($password.val().trim().length === 0){
        $password.addClass("error");
    }else{
        $password.removeClass("error");
    }

    if($account.val().trim().length > 0 && $password.val().trim().length > 0){
        socket.emit('argsen-login', {
            "account": $account.val().trim(),
            "password": $password.val().trim()
        });
    }

});