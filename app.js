const exp = require("express");
const exphbs = require("express-handlebars");
const bodyP = require("body-parser");
const mysql = require("mysql");

require("dotenv").config();

const app = exp();
const port = process.env.PORT || 5000;

var pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  insecureAuth: true,
});

pool.getConnection((err, connection) => {
  if (err) throw err;
  console.log("Connected " + connection.threadId);
});

app.use(bodyP.urlencoded({ extended: false }));
app.use(bodyP.json());

app.use(exp.static("public"));

app.engine("hbs", exphbs.engine({ extname: ".hbs" }));
app.set("view engine", "hbs");

const routes = require("./server/routes/user");
app.use("/", routes);

app.listen(port, () => console.log(`Listening on port ${port}`));
