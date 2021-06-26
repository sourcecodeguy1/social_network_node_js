    /**CREATE ERROR FUNCTION TO HANDLE FORM INPUT VALIDATION**/
    function errorHandler(element) {
        return element.css({border: "1px solid red", backgroundColor: "#F5D0D0"});
    }
    /**CREATE SUCCESS FUNCTION TO HANDLE FORM INPUT VALIDATION**/
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
    function inputEmailValidationBlur(element) {
        element.on('blur', function () {
            if(!isValidEmailAddress(element.val())){
                errorHandler(element);
            } else {
                successHandler(element);
            }
        });
    }
    /**CREATE A CHECK FUNCTION FOR EMAIL VALIDATION AND ADD BLUR EFFECT**/
    function isValidEmailAddress(emailAddress) {
        let pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
        return pattern.test(emailAddress);
    }

    /**SCROLL TO THE TOP FUNCTION**/
    function scrollToTop() {

        $('html, body').animate({
            scrollTop: $('#scroll_top').offset().top
        }, 'slow');
    }

    /**ELEMENT SLIDE TOGGLE FUNCTION**/
    function slideToggleFunction(element1, element2) {

        $(element1).click(function () {

            $(element2).slideToggle();

        });
    }












