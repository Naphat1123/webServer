let express = require("express");
let router = express.Router();
let dbCon = require("../lib/db");
const upload = require("express-fileupload");

router.use(upload());
router.use(express.static("upload"));

// display all users page
router.get("/", (req, res, next) => {
  res.render("list", { title: "title" });
});

// display single users
router.get("/:name", (req, res) => {
  let name = req.params.name;

  dbCon.query(
    "SELECT * FROM public_" + name + " ORDER BY id asc",
    (err, result) => {
      if (err) throw err;

      res.render(`list/${name}`, { data: result, name: name });
    }
  );
});

// display add file
router.get("/:name/add", (req, res) => {
  let name = req.params.name;

  res.render(`list/${name}/add`, { name: name });
});

// post functions
router.post("/:name/add", (req, res) => {
  let name = req.params.name;
  let fullName = req.body.name;
  let title = req.body.title;
  let deadline = req.body.deadline;
  let date = req.body.date;
  let file = req.files.file;
  let report = req.body.report;
  let uploadPath = "public/images/upload/" + file.name;
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
    res.render(`list/${name}/add`, {
      name: fullName,
      title: title,
      deadline: deadline,
      date: date,
      report: report,
      file_data: filename,
    });
  }

  //insert data
  if (!err) {
    let form_data = {
      name: fullName,
      title: title,
      deadline: deadline,
      date: date,
      report: report,
      file_data: filename,
    };

    // insert query
    dbCon.query(
      `INSERT INTO public_${name} SET ?`,
      form_data,
      (err, result) => {
        if (err) {
          req.flash("error", err);

          res.render(`list/${name}/add`, {
            name: fullName,
            title: title,
            deadline: deadline,
            date: date,
            report: report,
            file_data: filename,
          });
        } else {
          req.flash("success", "File success added");
          res.redirect(`/list/${name}`);
        }
      }
    );
  }
});

// disoplay edit page
router.get("/:name/edit/(:id)", (req, res) => {
  let name = req.params.name;
  let id = req.params.id;

  dbCon.query(
    `SELECT * FROM public_${name} WHERE id = ${id}`,
    (err, result) => {
      if (result.length === 0) {
        req.flash("error", `not found with ${id}`);
      } else {
        res.render(`list/${name}/edit`, {
          id: result[0].id,
          name: result[0].name,
          title: result[0].title,
          deadline: result[0].deadline,
          file_data: result[0].file_data,
          report: result[0].report,
          name: name,
        });
      }
    }
  );
});

router.post("/:name/edit/:id", (req, res) => {
  let name = req.params.name;
  let id = req.params.id;
  let fullName = req.body.name;
  let title = req.body.title;
  let deadline = req.body.deadline;
  let report = req.body.report;
  var file = req.files.file;
  let uploadPath = "public/images/upload/" + file.name;
  let err = false;

  if (req.files) {
    console.log(req.files);
    var filename = file.name;
    console.log(filename);

    file.mv(uploadPath, (err) => {
      if (err) {
        res.flash("error", err);
      }
    });
  }
  if (fullName === 0 || title === 0) {
    err = true;

    req.flash("error", "please enter name and title");
  }

  if (!err) {
    let form_data = {
      name: fullName,
      title: title,
      deadline: deadline,
      report: report,
      file_data: filename,
    };

    dbCon.query(
      `UPDATE public_${name} SET ? WHERE id = ${id}`,
      form_data,
      (err) => {
        if (err) {
          req.flash("error", err);

          res.render(`/list/${name}/edit`, {
            id: req.params.id,
            name: form_data.name,
            title: form_data.title,
            deadline: form_data.deadline,
            report: form_data.report,
            file_data: form_data.file_data,
          });
        } else {
          req.flash("success", "success");
          res.redirect(`/list/${name}`);
        }
      }
    );
  }
});

router.get("/:name/delete/(:id)", (req, res) => {
  let name = req.params.name;
  let id = req.params.id;

  dbCon.query(`DELETE FROM public_${name} WHERE id = ${id}`, (err, result) => {
    if (result.length === 0) {
      req.flash("error", err);
      res.redirect(`/list/${name}`);
    } else {
      req.flash("success", "delete success");
      res.redirect(`/list/${name}`);
    }
  });
});
module.exports = router;
