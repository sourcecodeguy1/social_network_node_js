/*UPLOAD PROFILE PICTURE*/
$(document).ready(function () {
   $('#add_profile_picture_title').click(function () {

       $('#add_profile_picture_panel').slideToggle();

   });

/*UPDATE PASSWORD FORM*/
   $('#update_password_title').click(function () {

       $('#update_password_panel').slideToggle();

   });

/*ADD OR UPDATE BIO*/
   $('#add_update_bio_title').click(function () {

       $('#add_update_bio_panel').slideToggle();

   });

/*DELETE USER PROFILE*/
   $('#delete_account_title').click(function () {

       $('#delete_account_panel').slideToggle();

   });

   $('#btnDelete').click(function () {

       $('.modal_alert').show();

       let username = $('#hidden_input_delete_account').val();
       console.log("Settings.ejs " +  username);

       // Show modal dialog message
       $('#modal_message').html("You are about to delete account with username " + "<strong>"+ username +"</strong>" + " once deleted, the account cannot be recovered. Continue?");

   });

   $('#modal_cancel_btn').on('click', function () {
      $('.modal_alert').hide();
   });

   $('#modal_x_btn').on('click', function () {
      $('.modal_alert').hide();
   });

});