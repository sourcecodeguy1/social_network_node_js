let mysql = require('mysql');

let mysql_connection = mysql.createPool({
    connectionLimit : 100,
    waitForConnections : true,
    queueLimit :0,
    host: 'localhost',
    user: '',
    password: '',
    database: '',
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



