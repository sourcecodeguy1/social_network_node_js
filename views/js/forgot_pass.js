$(document).ready(function () {

    // Create variable to gather user input.
    let email = $('#email');

    let error_msg = $('#error_msg');

    $('#btn_reset_pass').on('click', function (e) {
        e.preventDefault();

        if(email.val() === ""){
            errorHandler(email);
            error_msg.html("Please enter your email address.").slideDown().delay(5000).fadeOut();
        } else if(!isValidEmailAddress(email.val())){
            errorHandler(email);
            error_msg.html("Please enter a valid email address.").slideDown().delay(5000).fadeOut();
        } else {

            // Make ajax request to the server.
            $.ajax({
                url: "/forgotpass",
                type: "POST",
                data: {email: email.val()},
                success: function (data) {
                    if(data.result === "success"){

                        window.location.href = "/login";

                    } else {
                        error_msg.html(data.msg).slideDown().delay(5000).fadeOut();

                        scrollToTop();
                    }
                }
            });

        }

    });
    /**BLUR EFFECT FOR EMAIL**/
    inputValidationBlur(email);
    inputEmailValidationBlur(email);

});
