const cron = require('node-cron');
const mysql_connection = require('../db'); // Database connection file.

 let cronSchedule = cron.schedule('*/10 * * * * *', () => {

    //console.log('running a task every 10 seconds.');

    let time = Date.now();

    let sql = "SELECT * FROM forgot_pass_tbl";
    mysql_connection.query(sql, function (error, rows) {

        if (error){

            console.log(error);

        } else {

            if(rows.length > 0){

                let i;

                for(i = 0; i < rows.length; i++){

                    let db_expired_code = rows[i].expiration;

                    if(time > db_expired_code){

                        let delete_sql = "DELETE FROM forgot_pass_tbl WHERE expiration = ?";
                        mysql_connection.query(delete_sql, [db_expired_code], function (error, rows) {

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