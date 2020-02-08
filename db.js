let mysql = require('mysql');
let cred = require('./credentials');

let mysql_connection = mysql.createPool({
    connectionLimit : 100,
    waitForConnections : true,
    queueLimit :0,
    host: cred.db_host,
    user: cred.db_user,
    password: cred.db_pass,
    database: cred.db_name,
    debug    :  true,
    wait_timeout : 28800,
    connect_timeout :10
});

mysql_connection.getConnection(function (err) {
    if(err){
        console.log(err);
    } else {
        console.log("You have connected to the database successfully.");
    }
});

module.exports = mysql_connection;



