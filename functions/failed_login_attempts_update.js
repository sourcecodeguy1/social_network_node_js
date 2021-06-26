const mysql_connection = require('../db'); // Database connection file.

let failedLoginAttempts = function failedLoginAttemptsQuery(counter, expiration , username) {

    let sql_update = "UPDATE users SET failed_login_attempts = ?, expiration = ? WHERE username = ?";
    mysql_connection.query(sql_update, [counter, expiration , username]);

};

module.exports = failedLoginAttempts;