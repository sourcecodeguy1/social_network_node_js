let mysql = require('mysql');

let mysql_connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'social_network_node_js'
});

mysql_connection.connect(function (err) {
    if(err){
        console.log(err);
    }
});

module.exports = mysql_connection;