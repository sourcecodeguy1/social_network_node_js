$(document).ready(function () {
   $('#btnSubmitBio').click(function () {

       // Create variable for user input
       let user_bio = $('#user_bio');

       // Create error handlers variables
       let error_bio_handler = $('#error_bio_handler');

       let success_bio_handler = $('#success_bio_handler');

       // Check and validate user input
       if(user_bio.val() === ''){
           error_bio_handler.fadeIn().text('Bio field is empty!').delay(5000).fadeOut();
           success_bio_handler.hide();
       }else{
           /*success_bio_handler.fadeIn().text('Success!');
           error_bio_handler.hide();*/

           /**Set up URL route variable**/

           let url = '/bio_post';

           /**Set up Ajax callback**/

           $.ajax({
               url: url,
               type: 'POST',
               data: {user_bio: user_bio.val()},
               success: function (data) {

                   if(data.msg_err){

                       success_bio_handler.hide();
                       error_bio_handler.fadeIn().text(data.msg_err).delay(5000).fadeOut();
                       console.log(data.msg_err);

                   } else {
                       error_bio_handler.hide();
                       success_bio_handler.fadeIn().text(data.success_msg).delay(5000).fadeOut();
                       //window.location.href = '/profile/' + data.id;
                       console.log(data.id);
                   }


               }
           });

       }
   });
});