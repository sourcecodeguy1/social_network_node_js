$(document).ready(function () {

    // Create variables to gather user input.
    let username = $('#username');
    let password = $('#password');

    let error_msg = $('#error_msg');

    $('#btn_login').on('click', function (e) {
        e.preventDefault();

        if(username.val() === ""){
            errorHandler(username);
        } else if(password.val() === ""){
            errorHandler(password);
        } else {

            // Make ajax request to the server.
            $.ajax({
                url: "/login",
                type: "POST",
                data: {username: username.val(), password: password.val()},
                success: function (data) {
                    if(data.result === "success"){

                        window.location.href = "/profile/" + data.id;

                    } else {
                        error_msg.html(data.msg).slideDown().delay(5000).slideUp();

                        scrollToTop();
                    }
                }
            });


        }

    });
    /**BLUR EFFECT FOR USERNAME AND PASSWORD**/
    inputValidationBlur(username);
    inputValidationBlur(password);

});
