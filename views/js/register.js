$(document).ready(function () {
// Create a global variable for the form inputs

    let firstName = $('#txt_first_name');
    let lastName  = $('#txt_last_name');
    let email     = $('#txt_email');
    let username  = $('#txt_username');
    let password  = $('#txt_password');

    let user_bio  = $('#txt_user_bio');

    // Handle button click event

    $('#btn_register').on('click', function (e) {
        e.preventDefault();

        // Validate each input field

        if(firstName.val() === ""){
            errorHandler(firstName);
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
                        window.location.href = "/login";
                    }else{
                        alert(data.msg);
                    }
                }
            });

        }

    });

/**ADD BLUR EFFECT TO EACH INPUT FIELD**/

    inputValidationBlur(firstName);
    inputValidationBlur(lastName);
    inputValidationBlur(email);
    inputValidationBlur2(email);
    inputValidationBlur(username);
    inputValidationBlur(password);


    /**CREATE ERROR FUNCTION TO HANDLE FORM INPUT VALIDATION**/
    function errorHandler(element) {
        return element.css({border: "1px solid red", backgroundColor: "#F5D0D0"});
    }

    function successHandler(element) {
        return element.css({border: "1px solid green", backgroundColor: "#fff"});
    }

    /**CREATE INPUT VALIDATION AND ADDING BLUR EFFECT FUNCTION**/
    function inputValidationBlur(element) {
        element.on('blur', function () {
           if(element.val() === ""){
               errorHandler(element);
           } else {
               successHandler(element);
           }
        });
    }
    /**CREATE A CHECK FUNCTION FOR EMAIL VALIDATION AND ADD BLUR EFFECT**/
    function inputValidationBlur2(element) {
        element.on('blur', function () {
           if(!isValidEmailAddress(element.val())){
               errorHandler(element);
           } else {
               successHandler(element);
           }
        });
    }

    function isValidEmailAddress(emailAddress) {
        let pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
        return pattern.test(emailAddress);
    }

});

