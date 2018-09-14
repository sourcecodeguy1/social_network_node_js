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

/*let db_config = {
    host: 'us-cdbr-iron-east-01.cleardb.net',
    user: 'b322cccacc5365',
    password: 'b5b7cb79',
    database: 'heroku_f07b13119447b3c'
};

let connection;

function handleDisconnect() {
    connection = mysql.createConnection(db_config); // Recreate the connection, since
                                                    // the old one cannot be reused.

    connection.connect(function(err) {              // The server is either down
        if(err) {                                     // or restarting (takes a while sometimes).
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
        }                                     // to avoid a hot loop, and to allow our node script to
    });                                     // process asynchronous requests in the meantime.
                                            // If you're also serving http, display a 503 error.
    connection.on('error', function(err) {
        console.log('db error', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
            handleDisconnect();                         // lost due to either server restart, or a
        } else {                                      // connection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });

    module.exports = connection;
}

handleDisconnect();*/


