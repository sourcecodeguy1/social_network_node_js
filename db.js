let mysql = require('mysql');

let mysql_connection = mysql.createConnection({
    host: 'http://sql3.freemysqlhosting.net/',
    user: 'sql3254603',
    password: 'DjZWkTU84u',
    database: 'sql3254603'
});

mysql_connection.connect(function (err) {
    if(err){
        console.log(err);
    }
});

module.exports = mysql_connection;