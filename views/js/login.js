$(document).ready(function () {

    // Create variables to gather user input.
    let username = $('#username');
    let password = $('#password');

    $('#btn_login').on('click', function (e) {
        e.preventDefault();

        if(username.val() === ""){
            errorHandler(username);
        } else if(password.val() === ""){
            errorHandler(password);
        } else {
            alert("Done");
        }

    });

    inputValidationBlur(username);
    inputValidationBlur(password);

});
