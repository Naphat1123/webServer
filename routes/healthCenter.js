let express = require("express");
let router = express.Router();
let dbCon = require("../lib/db");
let upload = require("express-fileupload");

router.use(upload());
router.use(express.static("upload_health"));

// display all users page
router.get("/", (req, res, next) => {
  res.render("health_center", { title: "title" });
});

//หน้าแรกของหน้าเพิ่มรายงาน
router.get("/order_by_host_health", (req, res) => {
  dbCon.query("SELECT * FROM order_by_host_health", (err, result) => {
    if (err) throw err;

    res.render("health_center/order_by_host_health", { data: result });
  });
});

// หน้าเพิ่มข้อมูลให้กับ รพ.สต. ทั้งหมด
router.post("/order_by_host_health/add", (req, res) => {
  let fullName = req.body.name;
  let title = req.body.title;
  let date  = req.body.date
  let deadline = req.body.deadline;
  let report = req.body.report;
  var file = req.files.file;
  let uploadPath = "public/images/upload_health/" + file.name;
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
    res.redirect("/health_center/order_by_host_health/add");
  }

  //insert data
  if (!err) {
    let form_data = {
      fullname: fullName,
      title: title,
      deadline: deadline,
      date:date,
      report: report,
      file_data: filename,
    };

    // insert query
    dbCon.query(
      `INSERT INTO order_by_host_health SET ?`,
      form_data,
      (err, result) => {
        if (err) {
          req.flash("error", err);

          res.render(`/health_center/`, {
            fullname: fullName,
            title: title,
            deadline: deadline,
            date:date,
            report: report,
            file_data: filename,
          });
        } else {
          console.log("add complete");
          req.flash("success", "Data success added");
          res.redirect(`/health_center/order_by_host_health`);
        }
      }
    );
  }
});

// display single users
router.get("/:name", (req, res) => {
  let name = req.params.name;

  dbCon.query(
    `SELECT order_by_host_health.id,
    order_by_host_health.fullname,
    order_by_host_health.title,
    order_by_host_health.deadline,
    order_by_host_health.report,
    order_by_host_health.file_data,
    order_by_host_health.date,
    ${name}_health.file_data_health
    FROM order_by_host_health LEFT JOIN ${name}_health
    ON order_by_host_health.id = ${name}_health.id`,
    (err, result) => {
      if (err) throw err;

      res.render(`health_center/${name}`, { data: result, name: name });
    }
  );
});

// หน้าส่งไฟล์
router.post("/:name/:id", (req, res) => {
  let id = req.params.id;
  let name = req.params.name;
  let err = false;

  if (req.files) {
    let file = req.files.file;
    let uploadPath = "./public/upload_health/" + file.name;  
    var filename = file.name;

    file.mv(uploadPath, (err) => {
      if (err) {
        req.flash("error", "please insert file");
      }
    });
  }

  if (!err) {
    let form_data = { file_data_health: filename, id: id };

    dbCon.query(
      `INSERT INTO ${name}_health SET ?`,
      form_data,
      (err, result) => {
        if (err) {
          req.flash("error", err);
          res.redirect(`/health_center/${name}`);
        } else {
          req.flash("success", "Data success added");
          res.redirect(`/health_center/${name}`);
        }
      }
    );
  }
});

// display add file
router.get("/:name/add", (req, res) => {
  let name = req.params.name;

  res.render(`health_center/${name}/add`, { name: name });
});

// post functions
router.post("/:name/add", (req, res) => {
  let name = req.params.name;
  let fullName = req.body.name;
  let title = req.body.title;
  let deadline = req.body.deadline;
  let report = req.body.report;
  var file = req.files.file;
  let uploadPath = "./public/upload_health/" + file.name;
  let err = false;

  if (req.files) {
    console.log(req.files);
    var filename = file.name;
    console.log(filename);

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
    res.render(`/health_center/${name}/add`, {
      fullname: fullName,
      title: title,
      deadline: deadline,
      report: report,
      file_data: filename,
      name: name,
    });
  }

  //insert data
  if (!err) {
    let form_data = {
      fullname: fullName,
      title: title,
      deadline: deadline,
      report: report,
      file_data: filename,
    };

    // insert query
    dbCon.query(
      `INSERT INTO ${name}_health SET ?`,
      form_data,
      (err, result) => {
        if (err) {
          req.flash("error", err);

          res.render(`/health_center/${name}/add`, {
            fullname: fullName,
            title: title,
            deadline: deadline,
            report: report,
            file_data: filename,
          });
        } else {
          req.flash("success", "Data success added");
          res.redirect(`/health_center/${name}`);
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
    `SELECT * FROM order_by_host_health WHERE id = ${id}`,
    (err, result) => {
      if (result.length === 0) {
        req.flash("error", `not found with ${id}`);
      } else {
        res.render(`health_center/${name}/edit`, {
          id: result[0].id,
          fullname: result[0].fullname,
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

// update data
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
      fullName: fullName,
      title: title,
      deadline: deadline,
      report: report,
      file_data: filename,
    };

    dbCon.query(
      `UPDATE ${name}_health SET ? WHERE id = ${id}`,
      form_data,
      (err) => {
        if (err) {
          req.flash("error", err);

          res.render(`health_center/${name}/edit`, {
            id: req.params.id,
            fullName: form_data.fullName,
            title: form_data.title,
            deadline: form_data.deadline,
            report: form_data.report,
            file_data: form_data.file_data,
          });
        } else {
          req.flash("success", "Update data success");
          res.redirect(`/health_center/${name}`);
        }
      }
    );
  }
});

// delete data
router.get("/order_by_host_health/delete/(:id)", (req, res) => {
  let id = req.params.id;

  dbCon.query(
    `DELETE FROM order_by_host_health WHERE id = ${id}`,
    (err, result) => {
      if (result.length === 0) {
        req.flash("error", err);
        res.redirect(`/health_center/order_by_host_health`);
      } else {
        req.flash("success", "delete data success");
        res.redirect(`/health_center/order_by_host_health`);
      }
    }
  );
});

module.exports = router;
