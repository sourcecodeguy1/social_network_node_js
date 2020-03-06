$('#btn_upload_profile_picture').click(function () {

    let current_profile_pic_id = $('#hidden_profile_pic_id').val();
    let new_profile_pic = $('#txt_file_upload').val();

    let error_msg = $('#error_msg');

    $.ajax({
        url: "https://api.uploadcare.com/files/"+ current_profile_pic_id +"/",
        type: "DELETE",
        headers: { "Authorization": "Uploadcare.Simple e9c52880a8af766d0549:493c87678a3db2694ea8" }
    });

    /**SECOND AJAX REQUEST FOR POST NEW PICTURE INTO THE DATABASE**/

    $.ajax({

       url: "/upload",
       type: "POST" ,
       data: {newUploadedPicture: new_profile_pic},
       success: function (data) {

          if(data.result === "success"){

              window.location.href = '/profile/' + data.id;

          } else {
              error_msg.html(data.msg).slideDown().delay(5000).fadeOut();
          }

       }

    });

});
