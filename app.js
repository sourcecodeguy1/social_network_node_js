const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyparser = require ('body-parser');
const path = require('path');
const multer = require('multer');
const mysql_connection = require('./db'); // Database connection file.

require('dotenv').load();

// SET ENVIRONMENT VARIABLE FOR THE PORT
let port = process.env.PORT || 3500;

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

/*SET STORAGE ENGINE*/
/*const storage = multer.diskStorage({

    destination: './public/' + session_username + '/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});*/

/*INIT UPLOAD*/
/*const upload = multer({
    storage: storage
}).single('file_upload');*/

app.use(bodyparser.urlencoded({extended: false}));
app.set("view engine", "ejs");
//app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname)));

/*The code below makes sure the user is completely logged out and can't access his or her account by hitting the back button*/
app.use(function(req, res, next) {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
});

app.use(session({secret: "YOUR SECRET KEY HERE", resave: false, saveUninitialized: false}));



mysql_connection.query("SELECT * FROM users", function (error) {
   if(error){
       console.log("There was an error while trying to connect to the database. " + error);
   }else{
       console.log("Connected!");
   }
});

/*Route for index or landing page*/
app.get("/", function (req, res) {
    res.render("index");
});

/*Register route*/
app.get("/register", function (req, res) {
    if(session_username){
       res.redirect("/profile/" + session_id);
    }else {
        res.render("register");
    }
});

/*Process register page*/
app.post("/register_process", function (req, res) {
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

        // Hash the user password before inserting to the database.
        bcrypt.hash(password, 10, function (err, hash) {

        // // Insert data into database.
        mysql_connection.query("INSERT INTO users (first_name, last_name, username, email, password, user_bio, profile_picture) VALUES (?, ?, ?, ?, ?, ?, ?)", [FirstName, LastName, username, email, hash, bio, profile_picture], function (err, rows) {
           if(err){
               res.send(err);
           }else{
               if(rows.affectedRows === 1){
                   console.log("Data has been inserted.");

                   // Create user folder
                   let dir = "./public/users/" + username;

                   if (!fs.existsSync(dir)){

                       fs.mkdirSync(dir);

                       fse.copy('default.png', './public/users/' + username + '/profile_picture/default.png', err => {
                           if (err) return console.error(err);
                           console.log('Default picture copied to user folder successfully!');

                       });
                       res.redirect("/login");
                   }else{
                       res.send("An error has occurred!" + err);
                   }

               }else{
                   console.log("Data has not been inserted.");
               }
           }
        });
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
        res.render("login");
    }
});


/*Route for processing the login form and user input*/
app.post("/login_process", function (req, res) {
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
                        let db_pass = rows[i].password;
                        // Compare passwords between user input and database encryption.
                        bcrypt.compare(password, db_pass, function (err, result) {
                            if (result) {

                                console.log("Passwords match!");

                                // Store the current logged in user in a session.
                                session_id = req.session.rows = db_id;
                                session_username = req.session.rows = db_user;

                                console.log("session_id " + session_id + " session_username " + session_username);
                                res.redirect("/profile/" + session_id);

                            } else {
                                res.send("Username/Passwords are incorrect!");
                            }
                        });
                    }
                }else{
                    res.send("That user wasn't found.");
                }
            }
        });
    }
});

/*app.get("/profile", function (req, res) {

    if(!session_username){
        res.status(401).send("You are not authorized to view this page... FUCK OFF!!!");
    } else {
        const id = session_id;
        const username = session_username;
        //const current_logged_in_user = req.session.rows;
        console.log("Profile id is " + id + " and your username is " + username );

        mysql_connection.query("SELECT * FROM users WHERE username = ?", [username], function (err, rows) {

            if(err){
                console.log(err);
                res.send(err);
            }else{

                for(let i = 0; i < rows.length; i++){
                    let db_id = rows[i].id;
                    let db_username = rows[i].username;
                    let db_first_name = rows[i].first_name;
                    let db_last_name = rows[i].last_name;
                    let db_user_bio = nl2br(rows[i].user_bio);

                    res.render("profile", {u_id: db_id, username: db_username, logged_in_user: session_username, firstName: db_first_name, lastName: db_last_name, bio: db_user_bio});
                }

            }
        });
    }

});*/

app.get("/profile", function (req, res) {
    if(!session_username || session_username === null){
        res.redirect("/login");
    }else {
        res.redirect("/profile/" + session_id);

    }
});

/*
* 
* */

/*Route for profile page*/
app.get("/profile/:id", function (req, res) {

        console.log("Profile username: " + session_username);

        let get_id = req.params.id;

        //return res.status(401).send("Oops! The page that you are looking for wasn't found.");
        mysql_connection.query("SELECT * FROM users WHERE id = ?", [get_id], function (err, rows) {

            if(err){
                console.log(err);
                res.send(err);
            }else{

               if(rows.length === 0){
                   res.send("That user doesn't exist!!");
               }else{
                   for(let i = 0; i < rows.length; i++){
                       let db_username = rows[i].username;
                       let db_first_name = rows[i].first_name;
                       let db_last_name = rows[i].last_name;
                       let db_user_bio = nl2br(rows[i].user_bio);
                       let profile_picture = rows[i].profile_picture;

                       res.render("profile", {u_id: session_id, 'username': db_username, logged_in_user: session_username, firstName: db_first_name, lastName: db_last_name, bio: db_user_bio, user_profile_picture: profile_picture});
                   }
               }

            }
        });

    /*}else{
        const current_logged_in_user = req.session.rows;

        // Connect to the database and pull the current logged in user's details.
        mysql_connection.query("SELECT * FROM users WHERE username = ?", [current_logged_in_user], function (err, rows) {

            if(err){
                console.log(err);
                res.send(err);
            }else{

                for(let i = 0; i < rows.length; i++){
                    let db_id = rows[i].id;
                    let db_first_name = rows[i].first_name;
                    let db_last_name = rows[i].last_name;
                    let db_user_bio = nl2br(rows[i].user_bio);

                    res.render("profile", {id: db_id, logged_in_user: current_logged_in_user, firstName: db_first_name, lastName: db_last_name, bio: db_user_bio});
                }

            }

        });
    }*/

});

/*function nl2br(someText) {
    return someText.replace( /\n/g, "<br />" );
}*/

/*Route for logging out the user*/
app.get("/logout", function (req, res) {
    if(!session_username){
        return res.status(401).send("Oops! The page that you are looking for wasn't found.");
    }else{
        
        // Create a variable for the current logged in user.
        //let current_logged_in_user = req.session.rows;


        req.session.destroy(function (err) {
            if(err){
                res.send(err);
            }else{
                //res.render("logout", {user: current_logged_in_user});
                //res.redirect("/profile/"+session_id);
                // Destroy the current logged in user's session.
                session_id = null;
                session_username = null;

                res.redirect("/login");
            }
        });
    }
});

/**************************************************SETTINGS ROUTE*************************************************/


app.get('/settings', function (req, res) {
    if(session_username){

        mysql_connection.query("SELECT * FROM users WHERE id = ? ", [session_id], function (err, rows) {
            if(err){
                res.send(err);
            } else {
                // Loop through each user data and Fetch out current user data and send it to the settings route page
                for(let i = 0; i < rows.length; i++){
                    let db_bio = rows[i].user_bio;
                    let profile_picture = rows[i].profile_picture;
                    res.render("settings", {u_id: session_id, logged_in_user: session_username, bio: db_bio, user_profile_picture: profile_picture});
                }
            }
        });


    }else{
        res.redirect("login");
    }
});

/*UPLOAD IMAGE*/

app.post('/upload', function (req, res) {

        /*SET STORAGE ENGINE*/

        let dir = upload_user_path();

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);


            return upload_profile_image(req, res);


        } else {
            return upload_profile_image(req, res);
        }


});
/*FUNCTION FOR UPLOADING PROFILE IMAGE*/

function upload_user_path() {
    return './public/users/' + session_username + '/profile_picture';

}

function upload_profile_image(req, res){

        let dir = upload_user_path();

        const storage = multer.diskStorage({

            destination: dir,
            filename: function (req, file, cb) {
                cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
            }
        });

        /*INIT UPLOAD*/
        const upload = multer({
            storage: storage,
            limits: {fileSize: 1000000},
            fileFilter: function (req, file, cb) {
                checkFileType(file, cb);
            }
        }).single('file_upload');

        // Check File Type
    function checkFileType(file, cb){
        // Allow ext
        const filetypes = /jpeg|jpg|png|gif/;
        // Check ext
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        // Check mime
        const mimetype = filetypes.test(file.mimetype);

        if(mimetype && extname){
            return cb(null, true);
        } else {
            cb('Images Only!');
        }
    }

        upload(req, res, function (err) {
            if (err) {
                console.log(err);
                //res.render('settings', {u_id: session_id, logged_in_user: session_username, bio: '', msg: err});
                res.send(err);
            } else {

                if(req.file === undefined){
                    res.render('settings', {u_id: session_id, logged_in_user: session_username, bio: '', msg: 'No File Selected!'});
                    //res.send('No File Selected!');
                }else{
                    console.log("Success! Picture uploaded!");
                }
                /*UNLINK THE OLD IMAGE IF ANY THEN ADD THE NEW IMAGE*/
                /*CHECK IF THERE IS AN IMAGE IN THE DATABASE*/

                mysql_connection.query("SELECT * FROM users WHERE id = ? ", [session_id], function (error, rows) {
                    if (error) {
                        res.send(error);
                    } else {

                        for (let i = 0; i < rows.length; i++) {
                            let db_profile_picture = rows[i].profile_picture;

                            //console.log(db_profile_picture);

                            fs.unlink('./public/users/' + session_username + '/profile_picture/' + db_profile_picture, function (err) {
                                if (err) return console.log(err);
                                console.log('file deleted successfully');
                            });
                        }

                    }
                });

                /*UPDATE THE PROFILE PICTURE TO THE DATABASE*/
                mysql_connection.query("UPDATE users SET profile_picture = ? WHERE id = ?", [req.file.filename, session_id], function (err, rows) {
                    if (err) {
                        res.send(err);
                    } else {

                        if (rows.changedRows === 1) {

                            console.log(req.file);
                            console.log("You new file is " + req.file.filename);

                            res.redirect("/profile/" + session_id);

                        } else {
                            res.send(err);
                        }

                    }
                });


            }
        });

}

/*END OF FUNCTION FOR UPLOADING PROFILE IMAGE*/

/*END UPLOAD IMAGE*/

/*ADD OR UPDATE ROUTE*/
app.post('/bio_post', function (req, res) {


    // Get user input value

    let update_bio = req.body.user_bio;

    // Check if the input isn't empty
    if(update_bio !== "") {

        // Connect to mysql database

        mysql_connection.query("UPDATE users SET user_bio = ? WHERE id = ?", [update_bio, session_id], function (err, rows) {
            if (err) {
                let obj_error = {err: err};
                res.send(obj_error.err);
            } else {

                // Check if the post was successfully inserted into the database
                if (rows.changedRows === 1) {
                    //let id = {id: session_id};
                    //res.redirect("/profile/" + JSON.stringify(id.id));
                    //console.log("bio post id is: " + JSON.stringify(id.id));
                    let msg_success = {id: session_id, success_msg: 'Bio successfully inserted!'};
                    res.send(msg_success);

                } else {
                  /*  let msg_error = {msg_err: 'No changes were made to your bio.'};
                    res.send(msg_error);
                    console.log(msg_error);*/

                    res.render("settings", {bio_err_msg: "No changes were made to your bio."});

                }

            }
        });
    }else{
        //res.render("settings", {u_id: session_id, logged_in_user: session_username, bio: '', bio_msg: "Bio field cannot be empty."});
        res.send("Bio field is empty");
    }
});
/*END ADD OR UPDATE ROUTE*/

/************************************************END OF SETTING ROUTE********************************************/

/*Route error handling*/
app.get('*', function(req, res) {
    res.send('Oops! The page that you are looking for wasn\'t found.');
});

//Listen the port here
app.listen(app.get('port'), function () {
   console.log("Server started at port " + port);
});