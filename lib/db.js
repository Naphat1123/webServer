let mysql = require("mysql");
let connection = mysql.createConnection({
  host: "0.0.0.0",
  user: "root",
  password: "123456",
  database: "nodejs_crud",
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
