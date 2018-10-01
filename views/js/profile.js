$(document).ready(function () {

    const bio = $('li#bio').attr('class');
    const photos = $('li#photos').attr('class');
    const friends = $('li#friends').attr('class');

    $('li#bio').addClass('active');

    /*PROFILE PHOTOS TAB*/
    $('.bio').click(function () {

        if( bio === "" || photos === "active" || friends === "active"){

            $('li#friends').removeClass('active');
            $('.friends_panel').fadeOut();

            $('li#photos').removeClass('active');
            $('.photos_panel').fadeOut();

            $('li#bio').addClass('active');
            $('.bio_panel').delay('slow').show();


        }

    });

    $('.photos').click(function () {

        if( photos === "" || bio === "active" || friends === "active"){

            $('li#bio').removeClass('active');
            $('.bio_panel').fadeOut();

            $('li#friends').removeClass('active');
            $('.friends_panel').fadeOut();

            $('li#photos').addClass('active');
            $('.photos_panel').delay('slow').show();

        }

    });

    $('.friends').click(function () {

        if(friends === "" || bio === "active" || photos === "active"){

            $('li#bio').removeClass('active');
            $('.bio_panel').fadeOut();

            $('li#photos').removeClass('active');
            $('.photos_panel').fadeOut();

            $('li#friends').addClass('active');
            $('.friends_panel').delay('slow').show();

        }

    });

});