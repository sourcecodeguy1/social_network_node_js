const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyparser = require ('body-parser');
const path = require('path');

const rimraf = require('rimraf');
const cookieParser = require('cookie-parser');
const flash  = require('connect-flash');
const randomGenerator = require('./functions/randomGenerator');
const mysql_connection = require('./db'); // Database connection file.

require('./functions/forgot_pass_cron');
require('./functions/failed_login_attempts_cron');
let failed_login_attempt_query = require('./functions/failed_login_attempts_update');

require('dotenv').config();

const sendMessage = require("./send_email_function");

require('dotenv').load();

// SET ENVIRONMENT VARIABLE FOR THE PORT
let port = process.env.PORT || 5500;

app.set('port', (port));

/*PUBLIC FOLDER*/
app.use(express.static('./public'));

const fs = require('fs');

const fse = require('fs-extra');

const nl2br = require('nl2br');

const bcrypt = require('bcrypt');

const session = require('express-session');


/*Set global variables for session ID and session username*/
let session_id;
let session_username;
let session_email;


app.use(bodyparser.urlencoded({extended: false}));
app.set("view engine", "ejs");
//app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname)));

// Set up session and cookie parser
app.use(cookieParser('secret'));
app.use(session({secret: "YOUR SECRET KEY HERE", resave: true, saveUninitialized: true}));

// Use flash.
app.use(flash());

/*The code below makes sure the user is completely logged out and can't access his or her account by hitting the back button*/
app.use(function(req, res, next) {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

/*Route for index or landing page*/
app.get("/", function (req, res) {
    res.render("index");
});

/**LOAD MESSAGE TEMPLATE**/
app.get('/message', function (req, res) {
    res.render("message", {page: "message"});
});

/*Register route*/
app.get("/register", function (req, res) {
    if(session_username){
        res.redirect("/profile/" + session_id);
    }else {
        res.render("register", {u_id: session_id, logged_in_user: session_username, username: '', page: "register"});
        //console.log(sendMessage);
    }
});

/*Process register page*/
app.post("/register", function (req, res) {
    const FirstName = req.body.first_name;
    const LastName = req.body.last_name;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const bio = req.body.user_bio;

    const profile_picture = "default.png";

    if(FirstName === ""){
        res.send("Please enter your first name.");
    }else if(LastName === "") {
        res.send("Please enter your last name.");
    } else if(username === "") {
        res.send("Please enter your username.");
    } else if(email === ""){
        res.send("Please enter your email");
    }else if(password === ""){
        res.send("Please enter your password.");
    }else{

        /**CHECK IF THE USER EXISTS ALREADY**/

        mysql_connection.query("SELECT * FROM users WHERE username = ?", [username], function (error, rows) {
            if(error){
                res.send(error);
            } else {

                if(rows.length === 0){

                    mysql_connection.query("SELECT * FROM users WHERE email = ?", [email], function (error, rows) {

                        if(error){
                            res.send(error);
                        } else {

                            if(rows.length === 0){

                                // Hash the user password before inserting to the database.
                                bcrypt.hash(password, 10, function (err, hash) {

                                    // // Insert data into database.

                                    let insert_users_sql = "INSERT INTO users (first_name, last_name, username, email, password) VALUES (?, ?, ?, ?, ?)";
                                    mysql_connection.query(insert_users_sql, [FirstName, LastName, username, email, hash], function (err, rows) {
                                        if(err){
                                            res.send(err);
                                            console.log(err);
                                        }else{
                                            if(rows.affectedRows === 1){
                                                console.log("Data has been inserted.");

                                                let insert_user_settings_tbl = "INSERT INTO user_details (user_bio, profile_picture, user_website, user_website_2, user_website_3, user_id) VALUES (?, ?, ?, ?, ?, ?)";
                                                mysql_connection.query(insert_user_settings_tbl, [bio, profile_picture, '', '', '', rows.insertId]);

                                                /**Send email to the user**/
                                                //sendMessage(process.env.MAIL_USER, process.env.MAIL_PASS, process.env.MAIL_FROM, email, 'Registration Notification', 'Sample text here', 'ddrguy2 registration', 'Registration Notification', FirstName, 'Thank you for registering with us at ddrguy2.', 'Your account is ready to go.');


                                                // Create user folder
                                                let dir = "./public/users/" + username;

                                                if (!fs.existsSync(dir)){

                                                    fs.mkdirSync(dir);

                                                    fse.copy('default.png', './public/users/' + username + '/profile_picture/default.png', err => {
                                                        if (err) return console.error(err);
                                                        console.log('Default picture copied to user folder successfully!');

                                                    });


                                                    session_id = req.session.rows = rows.insertId;
                                                    session_username = req.session.rows = username;

                                                    req.flash("success", "Welcome, " + session_username );

                                                    let data_inserted = {result: "success", id: session_id};
                                                    res.send(data_inserted);


                                                }else{
                                                    let _error = {result: "error", msg: "An error has occurred, please try again."};
                                                    res.send(_error);
                                                }

                                            }else{
                                                console.log("Data has not been inserted.");
                                                let data_not_inserted = {result: "error", msg: "An error has occurred, please try again."};
                                                res.send(data_not_inserted);
                                            }
                                        }
                                    });
                                }); // End of bcrypt password encryption

                            } else {
                                let email_exists = {result: "error_email", msg: "A user with that email address already exists, please choose another email address."};
                                res.send(email_exists);
                            }
                        }
                    });

                } else {
                    let user_exists = {result: "error_username", msg: "That user already exists, please choose a different username."};
                    res.send(user_exists);
                }

            }
        });
    }
});

/*Route for login page*/
app.get("/login", function (req, res) {

    if(session_username){
        console.log("Active username: "+ session_username);
        res.redirect("/profile/" + session_id);
    }else{
        console.log("No session username found");
        res.render("login", {logged_in_user: session_username, page: "login"});
    }
});


/*Route for processing the login form and user input*/
app.post("/login", function (req, res) {

    const oneHour = Date.now() + 3600000; //1 hour
    const failedAttemptsTime = Date.now() + 900000; // 15 minutes
// Get username and password from the form.
    const username = req.body.username;
    const password = req.body.password;


    // Check if username and password are not empty
    if(username === ""){
        res.send("You must enter your username");
    }else if(password === ""){
        res.send("You must enter your password");
    }else{
        //Connect to the database and check if the user exists.
        mysql_connection.query("SELECT * FROM users WHERE username = ?", [username], function (err, rows) {
            if(err){
                res.send(err);
            }else{
                //Check if user exists before proceeding.
                if(rows.length === 1){



                    // Otherwise, loop through each record.
                    for(let i = 0; i < rows.length; i++) {
                        let db_id = rows[i].id;
                        let db_user = rows[i].username;
                        let db_email = rows[i].email;
                        let db_password = rows[i].password;
                        let db_failed_login_attempts = rows[i].failed_login_attempts;
                        let db_account_locked = rows[i].account_locked;


                            // Compare passwords between user input and database encryption.
                            bcrypt.compare(password, db_password, function (err, result) {

                                /**Check if the user account is locked**/
                                if(db_account_locked === 1){

                                    let _result = {result: "locked", msg: "It seems that your account has been locked due to a number of failed attempts."};
                                    res.send(_result);

                                }else {
                                    if (result) {

                                        // Store the current logged in user in a session.
                                        session_id = req.session.rows = db_id;
                                        session_username = req.session.rows = db_user;
                                        session_email = req.session.rows = db_email;

                                        req.flash("success", "Welcome, " + session_username );

                                        let _result = {result: "success", id: session_id};

                                        res.send(_result);

                                    } else {


                                        if(db_failed_login_attempts === 5){

                                            let _result = {result: "locking", msg: "Your account has been locked due to a number of failed attempts."};
                                            res.send(_result);

                                            let sql = "UPDATE users SET account_locked = ?, failed_login_attempts = ?, expiration = ? WHERE username = ?";
                                            mysql_connection.query(sql, ['1', '0', oneHour, db_user]);

                                            /** NOTIFY THE USER THAT HIS OR HER ACCOUNT HAS BEEN LOCKED **/

                                            sendMessage(process.env.MAIL_USER, process.env.MAIL_PASS, process.env.MAIL_FROM, db_email, 'Account Locked',
                                                'Account Locked Notification', 'ddrguy2 - Account Locked', 'Account Locked Notification', db_user,
                                                'This message is to inform you that your account has been locked due to a number of failed attempts. ' +
                                                'Your account will be locked for one hour. If you didn\'t make this attempt, we suggest that you use the link below to reset your password.',
                                                '<a href="https://ddrguy2.juliowebmaster.com/forgotpass">Reset Password</a>');

                                        } else {

                                            /** UPDATE THE FAILED LOGIN ATTEMPTS COLUMN IN THE DATABASE BASED ON THE USERNAME **/
                                            db_failed_login_attempts++;
                                            failed_login_attempt_query(db_failed_login_attempts, failedAttemptsTime, db_user);

                                            let _result = {result: "error", msg: "Username or Password is incorrect."};
                                            res.send(_result);
                                        }

                                    }
                                }

                            });



                        //return false;


                    }
                }else{
                    let _result = {result: "error", msg: "Username or Password is incorrect."};
                    res.send(_result);
                }
            }
        });
    }
});

app.get("/profile", function (req, res) {
    if(!session_username || session_username === null){
        res.redirect("/login");
    }else {
        res.redirect("/profile/" + session_id);

    }
});

/*Route for profile page*/
app.get("/profile/:id", function (req, res) {

    console.log("Profile username: " + session_username);

    let get_id = req.params.id;

    //return res.status(401).send("Oops! The page that you are looking for wasn't found.");
    //let sql_select = "SELECT * FROM user_details WHERE user_id = (SELECT username FROM users WHERE id = ?)";
    let sql_select = "SELECT * FROM user_details JOIN users ON user_details.user_id = users.id WHERE users.id = ?";
    mysql_connection.query(sql_select, [get_id], function (err, rows) {

        if(err){
            console.log(err);
            res.send(err);
        }else{

            if(rows.length === 0){
                res.send("That user doesn't exist!!");
            }else{
                for(let i = 0; i < rows.length; i++){
                    let db_username = rows[i].username;
                   /* let db_first_name = rows[i].first_name;
                    let db_last_name = rows[i].last_name;*/
                    let db_user_bio = nl2br(rows[i].user_bio);
                    let profile_picture = rows[i].profile_picture;
                    let db_user_website_1 = rows[i].user_website;
                    let db_user_website_2 = rows[i].user_website_2;
                    let db_user_website_3 = rows[i].user_website_3;
                    let created_at = rows[i].created_at;

                    let m = new Date(created_at);
                    let dateString =(m.getMonth()+1) +"/"+ m.getDate() +"/"+ m.getFullYear();

                    console.log(dateString);

                    res.render("profile", {

                        u_id: session_id,
                        params_id: get_id,
                        username: db_username,
                        logged_in_user: session_username,
                        bio: db_user_bio,
                        user_profile_picture: profile_picture,
                        userWebsite1: db_user_website_1,
                        userWebsite2: db_user_website_2,
                        userWebsite3: db_user_website_3,
                        page: "profile",
                        join: dateString

                    });

                }
            }

        }
    });
});

/*function nl2br(someText) {
    return someText.replace( /\n/g, "<br />" );
}*/

/*Route for logging out the user*/
app.get("/logout", function (req, res) {

    if(!session_username){
        return res.status(401).send("Oops! The page that you are looking for wasn't found.");
    }else{

        session_id = null;
        session_username = null;
        req.flash("success", "You have successfully logged out.");
        res.redirect("/login");

    }
});

/**************************************************SETTINGS ROUTE*************************************************/


app.get('/settings', function (req, res) {
    if(session_username){

        mysql_connection.query("SELECT * FROM user_details JOIN users ON user_details.user_id = users.id WHERE users.id = ? ", [session_id], function (err, rows) {
            if(err){
                res.send(err);
            } else {
                // Loop through each user data and Fetch out current user data and send it to the settings route page
                for(let i = 0; i < rows.length; i++){
                    let db_bio = rows[i].user_bio;
                    let db_username = rows[i].username;
                    let profile_picture = rows[i].profile_picture;
                    let db_user_website = rows[i].user_website;
                    let db_user_website_2 = rows[i].user_website_2;
                    let db_user_website_3 = rows[i].user_website_3;


                    res.render("settings", {
                        u_id: session_id,
                        username: db_username,
                        logged_in_user: session_username,
                        bio: db_bio,
                        user_profile_picture: profile_picture,
                        website_1: db_user_website,
                        website_2: db_user_website_2,
                        website_3: db_user_website_3,
                        page: "settings"
                    });
                }
            }
        });


    }else{
        res.redirect("login");
    }
});

/*UPLOAD IMAGE*/

app.post('/upload', function (req, res) {


    let avatar = req.body.newUploadedPicture;

    if (avatar === undefined || avatar === "") {

        let _result = {result: "error", msg: "No File Selected!"};
        res.send(_result);

    } else {

            /*UPDATE THE PROFILE PICTURE TO THE DATABASE*/
            mysql_connection.query("UPDATE user_details SET profile_picture = ? WHERE user_id = ?", [avatar, session_id], function (err, rows) {
                if (err) {
                    res.send(err);
                } else {

                    if (rows.changedRows === 1) {

                        let success = {result: "success", id: session_id};

                        res.send(success);

                        //res.redirect("/profile/" + session_id);

                    } else {
                        res.send(err);
                    }

                }
            });
    }




});
/*FUNCTION FOR UPLOADING PROFILE IMAGE*/

/*function upload_user_path() {
    return './public/users/' + session_username + '/profile_picture';

}*/




/*END OF FUNCTION FOR UPLOADING PROFILE IMAGE*/

/*END UPLOAD IMAGE*/

/*ADD OR UPDATE BIO ROUTE*/
app.post('/bio_post', function (req, res) {


    // Get user input value

    let update_bio = req.body.user_bio;

    // Check if the input isn't empty
    if(update_bio !== "") {

        // Connect to mysql database

        mysql_connection.query("UPDATE user_details SET user_bio = ? WHERE user_id = ?", [update_bio, session_id], function (err, rows) {
            if (err) {
                let obj_error = {err: err};
                res.send(obj_error.err);
            } else {

                // Check if the post was successfully inserted into the database
                if (rows.changedRows === 1) {
                    //let id = {id: session_id};
                    //res.redirect("/profile/" + JSON.stringify(id.id));
                    //console.log("bio post id is: " + JSON.stringify(id.id));
                    let msg_success = {id: session_id, success_msg: 'Bio Updated!'};
                    res.send(msg_success);

                } else {
                    let msg_error = {msg_err: 'No changes were made to your bio.'};
                    res.send(msg_error);

                }

            }
        });
    }else{
        //res.render("settings", {u_id: session_id, logged_in_user: session_username, bio: '', bio_msg: "Bio field cannot be empty."});
        res.send("Bio field is empty");
    }
});
/*END ADD OR UPDATE BIO ROUTE*/


/**USER SOCIAL MEDIA LINKS**/

app.post('/user_social_links', function (req, res) {

    /** GET USER INPUT FROM USER**/

    let social_link1 = req.body.link1.toLowerCase();
    let social_link2 = req.body.link2.toLowerCase();
    let social_link3 = req.body.link3.toLowerCase();


    /**UPDATE INTO DATABASE**/

    let update_social_links = "UPDATE user_details SET user_website = ?, user_website_2 = ?, user_website_3 = ?, created_at = CURRENT_TIMESTAMP WHERE user_id = ?";
    mysql_connection.query(update_social_links, [social_link1, social_link2, social_link3, session_id], function (error, rows) {

        if( error ) {
            let _result = {result: "error", msg: "An error has occurred. Please try again later."};
            res.send(_result);

        } else {

            if(rows.affectedRows === 1){

                let _result = {result: "success", msg: "Changes update!"};
                res.send(_result);

            } else {
                let _result = {result: "error", msg: "An error has occurred. Please try again later."};
                res.send(_result);
            }
        }

    });

});

/**END USER SOCIAL MEDIA LINKS**/

/**DELETE USER ACCOUNT**/
app.post('/delete', function (req, res) {
    // Connect to the database and delete the current logged in user_profile. This will only delete the constraint from this table.
    mysql_connection.query("DELETE FROM user_details WHERE user_id = ?", [session_id], function (err, row) {

        if(err){
            res.send(err);
        }else{
            if(row.affectedRows === 1){
                /**CREATE ANOTHER QUERY TO DELETE THE users table that contains that related user**/

                let delete_users_table = "DELETE FROM users WHERE id = ?";
                mysql_connection.query(delete_users_table, [session_id], function (err, rows) {

                    if(err){
                        let _result = {result: "error", msg: "An error has occurred, please try again later."};
                        res.send(_result);
                    } else {

                        if(rows.affectedRows === 1){

                            sendMessage(process.env.MAIL_USER, process.env.MAIL_PASS, process.env.MAIL_FROM, session_email, 'Deleted Account', 'Account deleted', 'ddrguy2 - Account Deleted', 'Deleted Account', session_username, 'We\'re sorry to see you go. Thank you for trying out ddrguy2.', 'You\'re account has been completely removed. Account recovery is not possible.');
                            removeUserFolder();
                            let delete_message = {result: "success", username: session_username};
                            res.send(delete_message);

                        } else {
                            let _result = {result: "error", msg: "An error has occurred, please try again later."};
                            res.send(_result);
                        }

                    }

                });

            } else {
                let delete_message = {result: "error", msg: "An error has occurred!"};
                res.send(delete_message);
            }
        }

    });

});
app.get('/deleted', function (req, res) {
    if(session_username){

        mysql_connection.query("SELECT * FROM users WHERE id = ? ", [session_id], function (err, rows) {
            if(err){
                res.send(err);
            } else {

                if(rows.length === 0){
                    session_id = null;
                    session_username = null;
                    session_email = null;
                    req.flash("success", "Your account has been deleted.");
                    res.redirect("/login");
                } else {
                    res.redirect("/profile/" + session_id );
                }

            }
        });


    } else {
        res.redirect("/login");
    }
});
/************************************************END OF SETTING ROUTE********************************************/

/**SEARCH ROUTE**/
app.post('/search', function (req, res) {

    let search = req.body.search_user;
    console.log(search);

    // Connect to the database and begin search based on username.
    mysql_connection.query("SELECT * FROM users WHERE username = ?", [search], function (err, rows) {
        if(err){
            res.send(err);
        } else {

            if(rows.length === 0){
                console.log(search);
                console.log("User NOT found!");
                let user_not_found = {result: "error", msg: "That user was not found."};

                res.send(user_not_found);

            } else {

                for(let i = 0; i < rows.length; i++){

                    let db_id = rows[i].id;

                    console.log("User found" + " " + db_id);
                    let user_found = {result: "success", msg: "User found!.", id: db_id};

                    res.send(user_found);

                }

            }

        }
    });
});

/**Forgot Password Route**/

app.get('/forgotpass', function (req, res) {

    if(session_username){
        res.redirect('/profile/' + session_id);
    } else {
        res.render('forgotpass', {page: "Forgot Password", logged_in_user: ""});
    }

});

app.post('/forgotpass', function (req, res) {

    let email = req.body.email;

    let code  = randomGenerator();

    const oneHour = Date.now() + 3600000;

    let codeExpires = oneHour; // 1 hour

    if(email !== ""){


        let sql = "SELECT * FROM users WHERE email = ?";

            mysql_connection.query(sql, [email], function (error, rows) {

                if(error){
                    res.send(error);
                } else {

                    if(rows.length === 0){

                        let notExists = {result: "error", msg: "We have no record by that email."};
                        res.send(notExists);

                    } else {

                        /** Check if there isn't an earlier requested forgot password**/

                        let sql = "SELECT * FROM forgot_pass_tbl WHERE email = ?";

                        mysql_connection.query(sql, [email], function (error, rows) {

                            if(error){
                                res.send(error);
                            } else {

                                if(rows.length === 1){

                                    let exists = {result: "error", msg: "Please check your email for instructions on how to reset your password."};
                                    res.send(exists);

                                } else {

                                    let user_id = null;
                                    let firstName = null;

                                    /**
                                        CREATE DATE, TIME, AND YEAR VARIABLES
                                     **/

                                    /*let months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

                                    let fullYear = new Date();
                                    let month = new Date();
                                    let day = new Date();
                                    let hour = new Date();
                                    let minute = new Date();
                                    let seconds = new Date();

                                    let yyyy = fullYear.getFullYear();
                                    let mm = months[month.getMonth()];
                                    let dd = day.getDate();
                                    let hh = hour.getHours();
                                    let _mm = minute.getMinutes();
                                    let ss = seconds.getSeconds();

                                    let completeDateTimeYear = yyyy+"-"+mm+"-"+dd+" "+hh+":"+_mm+":"+ss;*/

                                    let sql = "SELECT id, first_name FROM users WHERE email = ?";

                                    mysql_connection.query(sql, [email], function (error, rows) {

                                        if(error){
                                            res.send(error);

                                        } else {

                                            for(let i = 0; i < rows.length; i++){

                                                user_id = rows[i].id;
                                                firstName = rows[i].first_name;
                                            }

                                            let insert_sql = "INSERT INTO forgot_pass_tbl (code, expiration, user_id, email) VALUES (?,?,?,?)";
                                            mysql_connection.query(insert_sql, [code, codeExpires, user_id, email], function (error, rows) {

                                                if(error){
                                                    res.send(error);
                                                } else {

                                                    if(rows.affectedRows === 0){

                                                        let affected_rows = {result: "error", msg: "An error has occurred, please try again later."};

                                                        res.send(affected_rows);
                                                    } else {

                                                        req.flash("success", "Success! An email has been sent to "+ email);

                                                        let result = {result: "success"};

                                                        res.send(result);
                                                        sendMessage(process.env.MAIL_USER, process.env.MAIL_PASS, process.env.MAIL_FROM, email, 'Forgot Password',
                                                            'Forgot Password Request', 'ddrguy2 - Forgot Password', 'Forgot Password ', firstName,
                                                            'Use the link below to reset your password. If you did not request a password reset, then you can discard this message and your password will remain unchanged.' +
                                                            '<b>This link will expire in 1 hour</b>',
                                                            '<a href="https://ddrguy2.juliowebmaster.com/create-new-password/'+code+'">Reset Password</a>');

                                                    }

                                                }

                                            });

                                        }
                                    });
                                }

                            }

                        });
                    }
                }
            });

    } else {
        let result = {result: "error", msg: "Please enter your email to reset your password."};
        res.send(result);
    }
});

/**End Forgot Password Route**/

/**Create new password route**/

app.get('/create-new-password/:token', function (req, res) {
    if(session_username){
        res.redirect("/profile/" + session_id);
    }else {
        let time = Date.now();
        let token = req.params.token;

        /**RUN A QUERY TO THE DATABASE TO COMPARE THE URL TOKEN WITH THE USER'S TOKEN**/

        let sql = "SELECT * FROM forgot_pass_tbl WHERE code = ?";
        mysql_connection.query(sql, [token], function (error, rows) {

            if(error){
                res.send(error);
            } else {

                if(rows.length === 1){

                    for(let i = 0; i < rows.length; i++){

                        let db_token = rows[i].code;
                        let db_expiration = rows[i].expiration;

                        if(token === db_token){

                            if(time < db_expiration){
                                res.render("create-new-password", {token: token, logged_in_user: "", page: "Create New Password"});
                            } else{

                                res.send("Password reset link is invalid or has expired");

                                /**Delete the expired entry from the database**/
                                let delete_sql = "DELETE FROM forgot_pass_tbl WHERE code = ?";
                                mysql_connection.query(delete_sql, [token], function (error) {

                                    if(error){
                                        res.send("An internal error has occurred.");
                                    }

                                });
                            }

                        } else {
                            res.send("Password reset link is invalid or has expired");
                        }

                    }

                } else {
                    res.send("Password reset link is invalid or has expired");
                }

            }

        });

    }

});

/**End of create new password route**/


app.post('/create-new-password/:token', function (req, res) {

    let time = Date.now();

    let password = req.body.NewPassword;
    let confirmPassword = req.body.ConfirmPassword;

    let token = req.params.token;

    if(password !== ""){

        if(confirmPassword !== ""){

            if(password === confirmPassword){

                let sql = "SELECT * FROM forgot_pass_tbl WHERE code = ?";
                mysql_connection.query(sql, [token], function (error, rows) {

                    if(error){
                        let result = {result: "error", msg: "An error has occurred."};
                        res.send(result);
                    } else {

                        if(rows.length === 1){

                            for(let i = 0; i < rows.length; i++){

                                let db_expiration = rows[i].expiration;
                                let db_user_id = rows[i].user_id;

                                if(time < db_expiration){

                                    /**Hash the password before inserting to the database**/

                                    bcrypt.hash(password, 10, function (error, hash) {

                                        if(error){
                                            let result = {result: "error", msg: "An error has occurred. Please try again later."};
                                            res.send(result);
                                        } else {

                                            let sql_update = "UPDATE users SET password = ?, account_locked = ? WHERE id = ?";
                                            mysql_connection.query(sql_update, [hash, '0', db_user_id], function (error, rows) {

                                                if(error){
                                                    let result = {result: "error", msg: "An error has occurred. Please try again later."};
                                                    res.send(result);
                                                } else {

                                                    if(rows.affectedRows === 1){

                                                        req.flash("success", "Your password has been updated.");

                                                        let result = {result: "success"};
                                                        res.send(result);

                                                        let delete_sql = "DELETE FROM forgot_pass_tbl WHERE code = ?";
                                                        mysql_connection.query(delete_sql, [token]);

                                                    } else {
                                                        let result = {result: "error", msg: "An error has occurred. Please try again later."};
                                                        res.send(result);
                                                    }

                                                }

                                            });

                                        }

                                    });

                                } else {
                                    let result = {result: "error", msg: "Token may have expired or is invalid. Please re-submit a reset password."};
                                    res.send(result);
                                }

                            }

                        } else {
                            let result = {result: "error", msg: "Token may have expired or is invalid. Please re-submit a reset password."};
                            res.send(result);
                        }

                    }

                });

            } else {
                let result = {result: "error", msg: "Passwords do not match."};
                res.send(result);
            }

        } else {
            let result = {result: "error", msg: "Please enter your confirm password."};
            res.send(result);
        }

    } else {
        let result = {result: "error", msg: "Please enter your password."};
        res.send(result);
    }

});


/************************************************DASHBOARD ROUTE********************************************/

app.get('/dashboard', function (req, res) {
    if(session_username){

        // RETRIEVE ALL OF USER INFORMATION
        mysql_connection.query("SELECT * FROM user_details JOIN users ON user_details.user_id = users.id WHERE users.id = ? ", [session_id], function (err, rows) {
            if(err){
                res.send(err);
            } else {

                if(rows.length === 1){

                    for(let i = 0; i < rows.length; i++){

                        let db_username = rows[i].username;
                        let db_first_name = rows[i].first_name;
                        let db_last_name  = rows[i].last_name;
                        let db_user_bio = rows[i].user_bio;
                        let db_user_profile_picture = rows[i].profile_picture;


                            res.render("dashboard", {
                            u_id: session_id,
                            username: db_username,
                            logged_in_user: session_username,
                            firstName: db_first_name,
                            lastName: db_last_name,
                            bio: db_user_bio,
                            user_profile_picture: db_user_profile_picture,
                            page: "dashboard"
                        });

                    }

                } else {
                    res.redirect("/login");
                }

            }
        });


    }else{
        console.log("No session username found");
        //res.render("login", {logged_in_user: session_username, page: "login"});
        res.redirect('/login');
    }
});

/************************************************END OF DASHBOARD ROUTE********************************************/

/*Route error handling*/
app.get('*', function(req, res) {
    res.send('Oops! The page that you are looking for wasn\'t found.');
});

function removeUserFolder(){
    fse.remove('./public/users/' + session_username , function () {
        console.log( session_username + "'s" + " folder was removed!");
    } );
}

//Listen the port here
app.listen(app.get('port'), function () {
    console.log("Server started at port " + port + " with https.");
});
