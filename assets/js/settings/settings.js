/*UPLOAD PROFILE PICTURE*/
$(document).ready(function () {

    slideToggleFunction('#add_profile_picture_title', '#add_profile_picture_panel');

/*UPDATE PASSWORD FORM*/

    slideToggleFunction('#update_password_title', '#update_password_panel');

/*ADD OR UPDATE BIO*/

    slideToggleFunction('#add_update_bio_title', '#add_update_bio_panel');


/*ADD OR UPDATE SOCIAL WEBSITE LINKS*/
    slideToggleFunction('#add_update_social_media_links_title', '#add_update_social_media_links_panel');

/*DELETE USER PROFILE*/

    slideToggleFunction('#delete_account_title', '#delete_account_panel');



   $('#btnDelete').click(function () {

       $('.modal_alert').fadeIn();

       let username = $('#hidden_input_delete_account').val();

       // Show modal dialog message
       $('#modal_message').html("You are about to delete account with username " + "<strong>"+ username +"</strong>&#46;" + " Once deleted, the account cannot be recovered. Continue?");

   });

   $('#modal_cancel_btn').on('click', function () {
      $('.modal_alert').fadeOut();
   });

   $('#modal_x_btn').on('click', function () {
      $('.modal_alert').fadeOut();
   });


});