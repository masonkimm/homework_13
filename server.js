const exphbs = require("express-handlebars");
const express = require("express");
const mysql = require("mysql");
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "rlatjdwls",
  database: "foodapp_db",
});

connection.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});

app.get("/", function (req, res) {
  connection.query("SELECT * FROM food;", function (err, data) {
    if (err) throw err;

    res.render("index", { food: data });
  });
});

app.post("/", function (req, res) {
  connection.query(
    "INSERT INTO food (name) VALUES (?)",
    [req.body.name],
    function (err, result) {
      if (err) throw err;

      res.redirect("/");
    }
  );
});

app.listen(PORT, function () {
  console.log("Server listening on: http://localhost:" + PORT);
});
