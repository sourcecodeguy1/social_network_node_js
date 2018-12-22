let mysql = require('mysql');

/*let mysql_connection = mysql.createPool({
    connectionLimit : 100,
    waitForConnections : true,
    queueLimit :0,
    host: 'sql130.main-hosting.eu',
    user: 'u853150949_node',
    password: 'shishio1',
    database: 'u853150949_node',
    debug    :  true,
    wait_timeout : 28800,
    connect_timeout :10
});*/
let mysql_connection = mysql.createPool({
    connectionLimit : 100,
    waitForConnections : true,
    queueLimit :0,
    host: '65.19.141.67',
    user: 'julioweb_root',
    password: 'shishio1',
    database: 'julioweb_social_network_nodejs',
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



