let express = require("express");
let router = express.Router();
let dbCon = require("../lib/db");
let upload = require("express-fileupload");

router.use(upload());
router.use(express.static("event_images"));

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("dashboard");
});

// <-- START PAGE publicize -->

// START GET หน้าแรก ของ publicize
router.get("/publicize", (req, res, next) => {
  dbCon.query("SELECT * FROM publicize ORDER BY id DESC", (err, result) => {
    if (err) throw err;

    res.render("dashboard/publicize", { data: result });
  });
});
// END GET หน้าแรก ของ publicize

// START GET หน้า ADD ของ publicize
router.get("/publicize/add", (req, res, next) => {
  res.render("dashboard/publicize/add");
});
// END GET หน้า ADD ของ publicize

// -- START post function ของหน้า publicize  --
router.post("/publicize/add", (req, res, next) => {
  let fullName = req.body.name;
  let title = req.body.title;
  let date = req.body.date;
  let err = false;

  if (req.files) {
    let file = req.files.file;
    let uploadPath = "./public/upload_publicize/" + file.name;
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
    res.render(`/dashboard/publicize/add`, {
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
    dbCon.query(`INSERT INTO publicize SET ?`, form_data, (err, result) => {
      if (err) {
        req.flash("error", err);

        res.render(`/dashboard/publicize/add`, {
          name: fullName,
          title: title,
          date: date,
          file_data: filename,
        });
      } else {
        req.flash("success", "File success added");
        res.redirect(`/dashboard/publicize`);
      }
    });
  }
});
// -- END post function ของหน้า publicize  --

// -- START GET edit function ของหน้า publicize --
router.get(`/publicize/edit/:id`, (req, res, next) => {
  let id = req.params.id;

  dbCon.query(`SELECT * FROM publicize WHERE id = ${id}`, (err, result) => {
    if (result.length === 0) {
      req.flash("error", `not found with ${id}`);
    } else {
      res.render(`dashboard/publicize/edit`, {
        id: result[0].id,
        name: result[0].name,
        title: result[0].title,
        file_data: result[0].file_data,
      });
    }
  });
});
// -- END GET edit function ของหน้า publicize --

// -- START POST edit function publicize --
router.post(`/publicize/edit/:id`, (req, res, next) => {
  let id = req.params.id;
  let fullName = req.body.name;
  let title = req.body.title;
  let date = req.body.date;
  let file = req.files.file;
  let uploadPath = "./public/upload_publicize/" + file.name;
  let err = false;

  if (req.files) {
    var filename = file.name;

    file.mv(uploadPath, (err) => {
      if (err) {
        req.flash("error", "please insert file");
      }
    });
  }

  let form_data = {
    name: fullName,
    title: title,
    date: date,
    file_data: filename,
  };

  dbCon.query(
    `UPDATE publicize SET ? WHERE id = ${id}`,
    form_data,
    (err, result) => {
      if (err) {
        req.flash("error", err);
      } else {
        req.flash("success", "success");
        res.redirect("/dashboard/publicize");
      }
    }
  );
});
// -- END POST edit function publicize --

// -- START DELETE FUNCTION publicize --
router.get("/publicize/delete/:id", (req, res, next) => {
  let id = req.params.id;

  dbCon.query(`DELETE FROM publicize WHERE id = ${id}`, (err, result) => {
    if (result.length === 0) {
      req.flash("error", error);
      res.redirect("/dashboard/publicize");
    } else {
      req.flash("success", "delete complete");
      res.redirect("/dashboard/publicize");
    }
  });
});
// -- END DELETE FUNCTION publicize --

// <-- END PAGE publicize -->

// --------------------------------------------------------------------------------------------------

// <!-- START PAGE order_by_host_health -->

// -- START GET order_by_host_health --
router.get("/order_by_host_health", (req, res, next) => {
  dbCon.query(
    "SELECT * FROM order_by_host_health ORDER BY id DESC",
    (err, result) => {
      if (err) throw err;

      res.render("dashboard/order_by_host_health", { data: result });
    }
  );
});
// -- END GET order_by_host_health --

// -- START GET add order_by_host_health --
router.get("/order_by_host_health/add", (req, res, next) => {
  res.render("dashboard/order_by_host_health/add");
});
// -- END GET add order_by_host_health --

// -- START POST add order_by_host_health  --
router.post("/order_by_host_health/add", (req, res, next) => {
  let fullName = req.body.name;
  let title = req.body.title;
  let date = req.body.date;
  let deadline = req.body.deadline;
  let report = req.body.report;
  let err = false;

  if (req.files) {
    var file = req.files.file;
    var filename = file.name;
    let uploadPath = "./public/upload_order/" + file.name;

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
    res.redirect("/dashboard/order_by_host_health/add");
  }

  //insert data
  if (!err) {
    let form_data = {
      fullname: fullName,
      title: title,
      deadline: deadline,
      date: date,
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

          res.render(`dashboard/order_by_host_health/add`, {
            fullname: fullName,
            title: title,
            deadline: deadline,
            date: date,
            report: report,
            file_data: filename,
          });
        } else {
          req.flash("success", "Data success added");
          res.redirect(`/dashboard/order_by_host_health`);
        }
      }
    );
  }
});
// -- END POST add order_by_host_health  --

// -- START EDIT order_by_host_health  --
router.get(`/order_by_host_health/edit/:id`, (req, res, next) => {
  let id = req.params.id;

  dbCon.query(
    `SELECT * FROM order_by_host_health WHERE id = ${id}`,
    (err, result) => {
      if (result.length === 0) {
        req.flash("error", `not found with ${id}`);
      } else {
        res.render(`dashboard/order_by_host_health/edit`, {
          id: result[0].id,
          fullname: result[0].fullname,
          report: result[0].report,
          deadline: result[0].deadline,
          title: result[0].title,
          file_data: result[0].file_data,
        });
      }
    }
  );
});
// -- END GET edit order_by_host_health  --

// -- START POST edit order_by_host_health --
router.post(`/order_by_host_health/edit/:id`, (req, res, next) => {
  let id = req.params.id;
  let fullName = req.body.name;
  let title = req.body.title;
  let date = req.body.date;
  let deadline = req.body.deadline;
  let report = req.body.report;
  var file = req.files.file;
  let uploadPath = "./public/upload_order/" + file.name;
  let err = false;

  if (req.files) {
    var filename = file.name;

    file.mv(uploadPath, (err) => {
      if (err) {
        req.flash("error", "please insert file");
      }
    });
  }

  //insert data
  let form_data = {
    fullname: fullName,
    title: title,
    deadline: deadline,
    date: date,
    report: report,
    file_data: filename,
  };

  // insert query
  dbCon.query(
    `UPDATE  order_by_host_health SET ? WHERE id = ${id}`,
    form_data,
    (err, result) => {
      if (err) {
        req.flash("error", err);
      } else {
        req.flash("success", " success");
        res.redirect(`/dashboard/order_by_host_health`);
      }
    }
  );
});
// -- END POST edit function order_by_host_health --

// -- START DELETE FUNCTION order_by_host_health --
router.get("/order_by_host_health/delete/:id", (req, res, next) => {
  let id = req.params.id;

  dbCon.query(
    `DELETE FROM order_by_host_health WHERE id = ${id}`,
    (err, result) => {
      if (result.length === 0) {
        req.flash("error", error);
        res.redirect("/dashboard/order_by_host_health");
      } else {
        req.flash("success", "delete complete");
        res.redirect("/dashboard/order_by_host_health");
      }
    }
  );
});
// -- END DELETE FUNCTION order_by_host_health --

//  <!-- END PAGE order_by_host_health -->

// ----------------------------------------------------------------------------------------

//  <!-- START PAGE event_images -->

// -- START GET หน้าแรก event_images --
router.get("/event_images", (req, res, next) => {
  dbCon.query("SELECT * FROM event_images ORDER BY id DESC", (err, result) => {
    if (err) throw err;

    res.render("dashboard/event_images", { data: result });
  });
});

// -- END GET หน้าแรก event_images --

// -- START GET ADD event_images --
router.get("/event_images/add", (req, res, next) => {
  res.render("dashboard/event_images/add");
});
// -- END GET ADD event_images --

// -- START POST event_images --
router.post("/event_images/add", (req, res, next) => {
  let title = req.body.title;
  let err = false;

  if (req.files) {
    let file = req.files.file;
    var filename = file.name;
    let uploadPath = "./public/event_images/" + file.name;

    file.mv(uploadPath, (err) => {
      if (err) {
        req.flash("error", err);
      }
    });
  }

  let form_data = {
    title: title,
    file_images: filename,
  };

  dbCon.query(`INSERT INTO event_images SET ?`, form_data, (err, result) => {
    if (err) {
      req.flash("error", err);

      res.render(`dashboard/event_images/add`, {
        title: title,
        file_images: filename,
      });
    } else {
      req.flash("success", "Data success added");
      res.redirect(`/dashboard/event_images`);
    }
  });
});
// -- END POST event_images --

// -- START DELETE event_images --
router.get("/event_images/delete/:id", (req, res, next) => {
  let id = req.params.id;

  dbCon.query(
    `DELETE FROM event_images WHERE id = ${id}`,
    (err, result) => {
      if (result.length === 0) {
        req.flash("error", error);
        res.redirect("/dashboard/event_images");
      } else {
        req.flash("success", "delete complete");
        res.redirect("/dashboard/event_images");
      }
    }
  );
});
// -- END DELETE event_images --

// <!-- END PAGE event_images -->

// ------------------------------------------------------------------------------------------------

// <!-- START PAGE covid_images -->

// -- START GET หน้าแรก covid_images --
router.get("/covid_images", (req, res, next) => {
  dbCon.query("SELECT * FROM covid_images ORDER BY id DESC", (err, result) => {
    if (err) throw err;

    res.render("dashboard/covid_images", { data: result });
  });
});

// -- END GET หน้าแรก covid_images --


// -- START GET ADD covid_images --
router.get("/covid_images/add", (req, res, next) => {
  res.render("dashboard/covid_images/add");
});
// -- END GET ADD covid_images --

// -- START POST covid_images --
router.post("/covid_images/add", (req, res, next) => {
  let title = req.body.title;
  let err = false;

  if (req.files) {
    let file = req.files.file;
    var filename = file.name;
    let uploadPath = "./public/covid_images/" + file.name;

    file.mv(uploadPath, (err) => {
      if (err) {
        req.flash("error", err);
      }
    });
  }

  let form_data = {
    title: title,
    file_images: filename,
  };

  dbCon.query(`INSERT INTO covid_images SET ?`, form_data, (err, result) => {
    if (err) {
      req.flash("error", err);

      res.render(`dashboard/covid_images/add`, {
        title: title,
        file_images: filename,
      });
    } else {
      req.flash("success", "Data success added");
      res.redirect(`/dashboard/covid_images`);
    }
  });
});
// -- END POST covid_images --

// -- START DELETE covid_images --
router.get("/covid_images/delete/:id", (req, res, next) => {
  let id = req.params.id;

  dbCon.query(
    `DELETE FROM covid_images WHERE id = ${id}`,
    (err, result) => {
      if (result.length === 0) {
        req.flash("error", error);
        res.redirect("/dashboard/covid_images");
      } else {
        req.flash("success", "delete complete");
        res.redirect("/dashboard/covid_images");
      }
    }
  );
});
// -- END DELETE covid_images --

// <!-- END PAGE covid_images -->
module.exports = router;
