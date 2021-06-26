const cron = require('node-cron');
const mysql_connection = require('../db'); // Database connection file.

 let cronSchedule = cron.schedule('0 */1 * * *', () => {

    let time = Date.now(); /**Get the current time and date**/

    let sql = "SELECT * FROM forgot_pass_tbl";
    mysql_connection.query(sql, function (error, rows) {

        if (error){

            console.log(error);

        } else {

            if(rows.length > 0){

                let i;

                for(i = 0; i < rows.length; i++){

                    let token = rows[i].expiration;

                    if(time > token){

                        let expiredToken = token;

                        let delete_sql = "DELETE FROM forgot_pass_tbl WHERE expiration = ?";
                        mysql_connection.query(delete_sql, [expiredToken], function (error, rows) {

                            if (error){
                                console.log(error);
                            } else {

                                if(rows.affectedRows > 0){
                                    console.log("Deleted entries");
                                } else {
                                    console.log("Nothing deleted");
                                }

                            }

                        });

                    } else {
                        console.log("Link is still active");
                    }

                }

            } else {
                console.log("Nothing to delete here");
            }
        }



    });

}); /**END OF CRON JOB**/

module.exports = cronSchedule;