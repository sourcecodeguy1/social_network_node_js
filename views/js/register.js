$(document).ready(function () {

// Create a global variable for the form inputs

    let firstName = $('#txt_first_name');
    let lastName  = $('#txt_last_name');
    let email     = $('#txt_email');
    let username  = $('#txt_username');
    let password  = $('#txt_password');

    let user_bio  = $('#txt_user_bio');

    let error_msg = $('#error_msg');

    // Handle button click event

    $('#btn_register').on('click', function (e) {
        e.preventDefault();

        // Validate each input field

        if(firstName.val() === ""){
            errorHandler(firstName);
            scrollToTop();
        } else if(lastName.val() === ""){
            errorHandler(lastName);
        } else if(email.val() === "") {
            errorHandler(email);
        } else if(!isValidEmailAddress(email.val())) {
            errorHandler(email);
        } else if(username.val() === ""){
            errorHandler(username);
        } else if(password.val() === ""){
            errorHandler(password);
        } else {
            console.log("Done!");
            // Ajax call goes here.
            $.ajax({
                url: "/register",
                type: "POST",
                data: {first_name: firstName.val(), last_name: lastName.val(), email: email.val(), username: username.val(), password: password.val(), user_bio: user_bio.val()},
                success: function (data) {
                    if(data.result === "success"){
                        /**Send email to the user**/
                        window.location.href = "/login";
                    }else if(data.result === "error_username"){
                        errorHandler(username);
                        error_msg.html(data.msg).fadeIn().delay(5000).fadeOut();
                        scrollToTop();
                    } else if(data.result === "error_email"){
                        errorHandler(email);
                        error_msg.html(data.msg).fadeIn().delay(5000).fadeOut();
                        scrollToTop();
                    } else {
                        error_msg.html(data.msg).fadeIn().delay(5000).fadeOut();
                        scrollToTop();
                    }
                }
            });

        }

    });

/**ADD BLUR EFFECT TO EACH INPUT FIELD**/

    inputValidationBlur(firstName);
    inputValidationBlur(lastName);
    inputValidationBlur(email);
    inputEmailValidationBlur(email);
    inputValidationBlur(username);
    inputValidationBlur(password);

});

