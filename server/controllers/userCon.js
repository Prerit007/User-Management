const mysql = require("mysql");
require("dotenv").config();

const port = process.env.PORT || 5000;

var pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  insecureAuth: true,
});

exports.view = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("Connected " + connection.threadId);

    connection.query(
      "SELECT * FROM users WHERE status = 'Active'",
      (err, rows) => {
        if (!err) {
          let re = req.query.removed;
          res.render("home", { rows, re });
        } else {
          console.log(err);
        }
      }
    );
  });
};

exports.find = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("Connected " + connection.threadId);
    let searchTerm = req.body.se;
    connection.query(
      "SELECT * FROM users WHERE fname LIKE ? OR lname LIKE ? OR emial LIKE ? OR phone LIKE ?",
      [
        "%" + searchTerm + "%",
        "%" + searchTerm + "%",
        "%" + searchTerm + "%",
        "%" + searchTerm + "%",
      ],
      (err, rows) => {
        if (!err) {
          res.render("home", { rows });
        } else {
          console.log(err);
        }
      }
    );
  });
};

exports.form = (req, res) => {
  res.render("newuser");
};

exports.create = (req, res) => {
  const { fname, lname, emial, phone, comments } = req.body;
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("Connected " + connection.threadId);
    let searchTerm = req.body.se;
    connection.query(
      "INSERT INTO users SET fname = ?, lname = ?, emial = ?, phone = ?, comments = ?",
      [fname, lname, emial, phone, comments],
      (err, rows) => {
        res.render("newuser", { alert: "User Added Successfully." });
        res.redirect("/");
      }
    );
  });
};

exports.edit = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("Connected " + connection.threadId);

    connection.query(
      "SELECT * FROM users WHERE id = ?",
      [req.params.id],
      (err, rows) => {
        if (!err) {
          res.render("edit-user", { rows });
        } else {
          console.log(err);
        }
      }
    );
  });
};

exports.update = (req, res) => {
  const { fname, lname, emial, phone, comments } = req.body;
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("Connected " + connection.threadId);

    connection.query(
      "UPDATE users SET fname = ?, lname = ?, emial = ?, phone = ?, comments = ? WHERE id = ?",
      [fname, lname, emial, phone, comments, req.params.id],
      (err, rows) => {
        if (!err) {
          pool.getConnection((err, connection) => {
            if (err) throw err;
            console.log("Connected " + connection.threadId);

            connection.query(
              "SELECT * FROM users WHERE id = ?",
              [req.params.id],
              (err, rows) => {
                if (!err) {
                  res.render("edit-user", {
                    rows,
                    alert: "User Updated Successfully",
                  });
                  res.redirect("/");
                } else {
                  console.log(err);
                }
              }
            );
          });
        } else {
          console.log(err);
        }
      }
    );
  });
};

// Can also be done by deleting the query instead of updating the table
exports.delete = (req, res) => {
  connection.query(
    "DELETE FROM users WHERE id = ?",
    [req.params.id],
    (err, rows) => {
      if (!err) {
        let removedUser = encodeURIComponent("User successeflly removed.");
        res.redirect("/?removed=" + removedUser);
      } else {
        console.log(err);
      }
    }
  );
};

exports.see = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;

    connection.query(
      "SELECT * FROM users WHERE id = ? AND status = 'Active'",
      [req.params.id],
      (err, rows) => {
        if (!err) {
          res.render("view-user", { rows });
        } else {
          console.log(err);
        }
      }
    );
  });
};
