let mysql = require('mysql');

let mysql_connection = mysql.createConnection({
    host: 'sql130.main-hosting.eu',
    user: 'u853150949_node',
    password: 'shishio1',
    database: 'u853150949_node'
});

mysql_connection.connect(function (err) {
    if(err){
        console.log(err);
    }
});

module.exports = mysql_connection;