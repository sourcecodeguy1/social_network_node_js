$(document).ready(function () {
    $('#modal_ok_btn').on('click', function () {

            $.ajax({
                url: '/delete',
                type: 'POST',
                success: function (data) {
                    if(data.result === "success"){
                        //Redirect the user to the login page.
                        window.location.href = "/logout";
                    } else {
                        $('#modal_message').html(data.msg);
                    }
                }
            });


    });
});