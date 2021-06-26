$(document).ready(function () {
    // Create variable to gather user input.
    let password = $('#create_new_password');
    let confirmPassword = $('#create_new_password_confirm');

    let error_msg = $('#error_msg');

    /**Get the token parameter from the URL**/

    let url = window.location.pathname;
    //let id  = url.substring(url.lastIndexOf('/') + 1);

    $('#btn_submit_new_password').on('click', function (e) {
        e.preventDefault();

        if(password.val() !== ""){

            if(confirmPassword.val() !== "") {

                if(password.val() === confirmPassword.val()){

                    // Make ajax request to the server.
                    $.ajax({
                        url: url,
                        type: "POST",
                        data: {NewPassword: password.val(), ConfirmPassword: confirmPassword.val()},
                        success: function (data) {
                            if(data.result === "success"){

                                window.location.href = "/login";

                            } else {
                                error_msg.html(data.msg).slideDown().delay(5000).fadeOut();
                                scrollToTop();
                            }
                        }
                    });

                } else {
                    errorHandler(password);
                    errorHandler(confirmPassword);
                    error_msg.html("The passwords do not match.").slideDown().delay(5000).fadeOut();
                }

            } else {
                errorHandler(confirmPassword);
            }

        } else {
            errorHandler(password);
        }

    });

    /**BLUR EFFECT FOR PASSWORD**/
    inputValidationBlur(password);
    inputValidationBlur(confirmPassword);

});
