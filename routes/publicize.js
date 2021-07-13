let express = require("express");
let router = express.Router();
let dbCon = require("../lib/db");
let upload = require("express-fileupload");

router.use(upload());
router.use(express.static("upload_publicize"));

/* GET home page. */
router.get("/", function (req, res, next) {
  dbCon.query("SELECT * FROM publicize ORDER BY id desc", (err, result) => {
    if (err) {
      console.log("fatal error: " + err.message);
    }

    res.render("publicize", { data: result });
  });
});

router.get("/add", (req, res, next) => {
  res.render("publicize/add");
});

router.post("/add", (req, res, next) => {
  let fullName = req.body.name;
  let title = req.body.title;
  let date = req.body.date;
  let file = req.files.file;
  let uploadPath = "upload_publicize/" + file.name;
  let err = false;

  if (req.files) {
    var filename = file.name;

    file.mv(uploadPath, (err) => {
      if (err) {
        req.flash("error", "please insert file");
      }
    });

  } 

  if (fullName.length === 0 || title.length === 0) {
    error = true;
    // set flash msg
    req.flash("error", "Please enter name and author");
    // render to add.ejs
    res.render(`publicize/add`, {
      name: fullName,
      title: title,
      date: date,
      file_data: filename,
    });
  }

  //insert data
  if (!err) {
    let form_data = {
      name: fullName,
      title: title,
      date: date,
      file_data: filename,
    };

    // insert query
    dbCon.query(
      `INSERT INTO publicize SET ?`,
      form_data,
      (err, result) => {
        if (err) {
          req.flash("error", err);

          res.render(`publicize/add`, {
            name: fullName,
            title: title,
            date: date,
            file_data: filename,
          });
        } else {
          req.flash("success", "File success added");
          res.redirect(`/publicize`);
        }
      }
    );
  }
});

module.exports = router;
