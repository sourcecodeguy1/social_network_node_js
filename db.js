let mysql = require('mysql');

let mysql_connection = mysql.createConnection({
    host: 'https://www.db4free.net/phpMyAdmin/index.php',
    user: 'node_js',
    password: 'shishio1',
    database: 'node_js'
});

mysql_connection.connect(function (err) {
    if(err){
        console.log(err);
    }
});

module.exports = mysql_connection;