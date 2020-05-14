const exphbs = require("express-handlebars");
const config = require("./config/db");
const express = require("express");
const mysql = require("mysql");
const app = express();

const PORT = process.env.PORT || 8080;

const dbConfig =
  process.env.NODE_ENV === "production" ? config.heroku : config.db;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});

// handlebars to render the main index.html page

// getting db from tables: food & finished_food
app.get("/", (req, res) => {
  connection.query("SELECT * FROM food", (err, unfinished) => {
    if (err) {
      return res.status(500).end();
    }
    connection.query(
      "SELECT * FROM finished_food WHERE finished=true",
      (err, showfinished) => {
        if (err) {
          return res.status(500).end();
        }
        connection.query(
          "SELECT * FROM finished_food WHERE finished=false",
          (err, hidefinished) => {
            if (err) {
              return res.status(500).end();
            }
            res.render("index", {
              food: unfinished,
              finished: showfinished,
            });
          }
        );
      }
    );
  });
});

// handling request to post finished_food into finished_food part of html
app.get("/api/:id", (req, res) => {
  connection.query(
    "UPDATE finished_food SET ? WHERE ?",
    [
      {
        finished: true,
      },
      {
        id: req.params.id,
      },
    ],
    (err, res) => {
      if (err) throw err;
    }
  );
});

// posting user input into 2 different tables in db
app.post("/", (req, res) => {
  connection.query(
    "INSERT INTO food (name) VALUES (?)",
    [req.body.name],
    (err, res) => {
      if (err) throw err;
    }
  );
  connection.query(
    "INSERT INTO finished_food SET ?",
    {
      name: req.body.name,
      finished: false,
    },
    (err, res) => {
      if (err) {
        return res.status(500).end();
      }
    }
  );
  res.redirect("/");
});

// delete route
app.delete("/api/food/:id", (req, res) => {
  connection.query(
    "DELETE FROM food WHERE id = ?",
    [req.params.id],
    (err, result) => {
      if (err) {
        // If an error occurred, send a generic server failure
        return res.status(500).end();
      } else if (result.affectedRows === 0) {
        // If no rows were changed, then the ID must not exist, so 404
        return res.status(404).end();
      }
      res.status(200).end();
    }
  );
});

// PORT listener
app.listen(PORT, () => {
  console.log("Server listening on: http://localhost:" + PORT);
});
