/*const mysql_connection = require('./db'); // Database connection file.

let time = Date.now();

let sql = "SELECT * FROM forgot_pass_tbl";
mysql_connection.query(sql, function (rows) {

    let i;
    for(i = 0; i < rows.length; i++){

        let db_expired_code = rows[i].expiration;

        if(time > db_expired_code){

            let delete_sql = "DELETE FROM forgot_pass_tbl WHERE expiration = ?";
            mysql_connection.query(delete_sql, [db_expired_code]);

        }

    }

});*/

console.log("This is forgot_pass_cron js file.");