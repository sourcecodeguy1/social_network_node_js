const nodemailer = require("nodemailer");
/**CREATE A FUNCTION TO HANDLE THE E-MAIL SENDING STUFF**/

/**
 parameters (15)
 returns an array of unlimited parameters

 */

let sendMessage = function sendEmail(user, pass, from, to, subject, text, title, msg1, firstname, msg2, msg3) {

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'mail.juliowebmaster.com',
        //port: 587,
        //secure: false, // true for 465, false for other ports
        auth: {
            user: user, // generated ethereal user
            pass: pass // generated ethereal password
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: from, // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
        html: "<!DOCTYPE html>" +
            "<html>" +
            "<head>" +
            "<meta charset=\"UTF-8\"><title>"+ title +"</title>" +
            "</head>" +
            "<body style=\"margin:0px; font-family:Tahoma, Geneva, sans-serif;\"><div style=\"padding:10px; background:#333; font-size:24px; color:#CCC;\">"+ msg1 +"</div><div><p><a href='https://ddrguy2.juliowebmaster.com'><img src='https://ddrguy2.juliowebmaster.com/HEADER_DDRGUY_LOGO.png' alt='ddrguy2' width='300' height='100'></a></p></div><div style=\"padding:24px; font-size:17px;\">Hello, " + "<strong>" + firstname + "</strong>" + "<br /><p>"+ msg2 +"</p><p>"+ msg3 +"</p></div>" +
            "</body>" +
            "</html>" // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){

        if(error){
            return console.log(error);

        }
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    });

    return user, pass, mailOptions;
};

module.exports = sendMessage;
