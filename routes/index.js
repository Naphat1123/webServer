var express = require("express");
var router = express.Router();
let db = require("../lib/db");

/* GET home page. */
router.get("/", function (req, res, next) {
  db.query(
    "SELECT * FROM order_by_host_health ORDER BY id DESC LIMIT 5; SELECT * FROM publicize ORDER BY id DESC LIMIT 5; SELECT * FROM event_images ORDER BY id DESC LIMIT 5;  SELECT * FROM covid_images ORDER BY id DESC LIMIT 1;",
    (err, result) => {
      if (err) {
        console.log(err);
      }

      res.render("index", {
        data: result[0],
        publicize: result[1],
        data3: result[2],
        covid_images:result[3]
      });
    }
  );
});

module.exports = router;
