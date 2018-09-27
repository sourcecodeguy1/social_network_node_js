$(document).ready(function () {
    $('#btnDelete').on('click', function () {

        let username = $('#hidden_input_delete_account').val();

        // Prompt a confirm box to the user to verify account deletion.

        let conf = confirm("ARE YOU SURE YOU WANT TO DELETE ACCOUNT WITH USERNAME: " + username.toUpperCase() + "? ONCE DELETED, YOU WILL NOT BE ABLE TO RECOVER THE ACCOUNT!!! CONTINUE?");

        if(conf){ // Proceed with the deletion of the account if the user selected OK.
            $.ajax({
                url: '/delete',
                type: 'POST',
                success: function (data) {
                    if(data.result === "success"){
                        //Redirect the user to the login page.
                        window.location.href = "/logout";
                    } else {
                        alert(data.msg);
                    }
                }
            });
        }

    });
});