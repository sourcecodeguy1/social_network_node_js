$(document).ready(function () {
    // Create variable to gather user input.
    let website_1 = $('#txt_website_link_1');
    let website_2 = $('#txt_website_link_2');
    let website_3 = $('#txt_website_link_3');

    let error_msg = $('#error_msg');

    let success_social_links_handler = $('#success_social_media_links_handler');

    $('#btnSubmitSocialLinks').on('click', function (e) {

        e.preventDefault();

        // Make ajax request to the server.
        $.ajax({
            url: '/user_social_links',
            type: "POST",
            data: {link1: website_1.val(), link2: website_2.val(), link3: website_3.val()},
            success: function (data) {
                if(data.result === "success"){

                    success_social_links_handler.fadeIn().text(data.msg).delay(5000).fadeOut();

                } else {
                    error_msg.html(data.msg).slideDown().delay(5000).fadeOut();
                    scrollToTop();
                }
            }
        });

    });

});
