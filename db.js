let mysql = require('mysql');

let mysql_connection = mysql.createConnection({
    host: 'us-cdbr-iron-east-01.cleardb.net',
    user: 'b322cccacc5365',
    password: 'b5b7cb79',
    database: 'heroku_f07b13119447b3c'
});

mysql_connection.connect(function (err) {
    if(err){
        console.log(err);
    }
});

module.exports = mysql_connection;