const cron = require('node-cron');
const mysql_connection = require('../db'); // Database connection file.

let failedAttemptsCron = cron.schedule('*/1 * * * *', () => {

    let time = Date.now(); /**Get the current time and date**/

    let sql = "SELECT * FROM users WHERE account_locked = ? OR failed_login_attempts > ?";
    mysql_connection.query(sql, ['1', '0'], function (error, rows) {

        if (error){

            console.log(error);

        } else {

            if(rows.length > 0){

                let i;

                for(i = 0; i < rows.length; i++){

                    let exp = rows[i].expiration;


                        if(time > exp){

                            let expiredFailedLoginAttempt = exp;

                            let update_sql = "UPDATE users SET account_locked = ?, failed_login_attempts = ? WHERE expiration = ?";
                            mysql_connection.query(update_sql, ['0', '0', expiredFailedLoginAttempt], function (error, rows) {

                                if (error){
                                    console.log(error);
                                } else {

                                    if(rows.affectedRows > 0){
                                        console.log("Updated entries");
                                    } else {
                                        console.log("An error has occurred!");
                                    }

                                }

                            });

                        } else {
                            console.log("Link is still active");
                        }
                }

            } else {
                console.log("Nothing to update here");
            }
        }
    });

}); /**END OF CRON JOB**/

module.exports = failedAttemptsCron;