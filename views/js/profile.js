$(document).ready(function () {

    $('#flash_msg_success').delay(3000).fadeOut();

    const bio = $('li#bio').attr('class');
    const photos = $('li#photos').attr('class');
    const friends = $('li#friends').attr('class');

    $('li#bio').addClass('active');

    /*PROFILE PHOTOS TAB*/
    $('.bio').click(function () {

        if( bio === "" || photos === "active" || friends === "active"){

            $('li#friends').removeClass('active');
            $('.friends_panel').hide();

            $('li#photos').removeClass('active');
            $('.photos_panel').hide();

            $('li#bio').addClass('active');
            $('.bio_panel').delay('slow').show();


        }

    });

    $('.photos').click(function () {

        if( photos === "" || bio === "active" || friends === "active"){

            $('li#bio').removeClass('active');
            $('.bio_panel').hide();

            $('li#friends').removeClass('active');
            $('.friends_panel').hide();

            $('li#photos').addClass('active');
            $('.photos_panel').delay('slow').show();

        }

    });

    $('.friends').click(function () {

        if(friends === "" || bio === "active" || photos === "active"){

            $('li#bio').removeClass('active');
            $('.bio_panel').hide();

            $('li#photos').removeClass('active');
            $('.photos_panel').hide();

            $('li#friends').addClass('active');
            $('.friends_panel').delay('slow').show();

        }

    });

});