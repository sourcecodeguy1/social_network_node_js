$(document).ready(function () {

    let search_input = $('#search_user');

    $('#btn_search').on('click', function (e) {
        e.preventDefault();

        if(search_input.val() !== ""){

            const url = "/search";

            $.ajax({
                url: url,
                type: "POST",
                data: {search_user: search_input.val()},
                success: function (data) {
                    if(data.result === "error"){
                        search_input.val(data.msg).select();
                    } else {
                        window.location.href = "/profile/" + data.id ;
                    }
                }
            });

        } else {
            search_input.css({border: "1px solid red", backgroundColor: "#F5D0D0"});
            search_input.focus();
        }

    });

});