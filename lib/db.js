let mysql = require("mysql");
let connection = mysql.createConnection({
    host: "0.0.0.0",
    user: "root",
    password: "",
    database: "node",
    multipleStatements: true,
});

connection.connect((error) => {
    if (!connection) {
        console.log(error);
    } else {
        console.log("connected...");
    }
});

module.exports = connection;
