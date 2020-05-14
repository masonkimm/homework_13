var exphbs = require("express-handlebars");
var express = require("express");
var mysql = require("mysql");
var app = express();

var PORT = process.env.PORT || 8080;

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

// handlebars to render the main index.html page with the foods in it.
app.get("/", function (req, res) {
  connection.query("SELECT * FROM food", function (err, unfinished) {
    if (err) {
      return res.status(500).end();
    }
    connection.query(
      "SELECT * FROM finished_food WHERE finished=true",
      function (err, showfinished) {
        if (err) {
          return res.status(500).end();
        }
        connection.query(
          "SELECT * FROM finished_food WHERE finished=false",
          function (err, hidefinished) {
            if (err) {
              return res.status(500).end();
            }
            res.render("index", {
              food: unfinished,
              finished: showfinished,
              // finished: hidefinished,
            });
          }
        );
        // res.render("index", { food: unfinished, showfinished: showfinished  });
      }
    );
    // res.render("index", { food: unfinished  });
  });
});

// Create a new plan
// app.post("/api/food", function (req, res) {
//   connection.query(
//     "INSERT INTO food (name) VALUES (?)",
//     [req.body.name],
//     function (err, result) {
//       if (err) {
//         return res.status(500).end();
//       }
//       connection.query(
//         "INSERT INTO finished_food (name) VALUES (?)",
//         [req.body.name],
//         function (err, result) {
//           if (err) {
//             return res.status(500).end();
//           }
//           // Send back the ID of the new plan
//           res.json({ id: result.insertId });
//           console.log({ id: result.insertId });
//         }
//       );
//     }
//   );
// });
app.post("/", function (req, res) {
  connection.query(
    "INSERT INTO food SET ?",
    {
      name: req.body.name,
    },
    function (err, res) {
      if (err) throw err;
    }
  );
  connection.query(
    "INSERT INTO finished_food SET ?",
    {
      name: req.body.name,
      finished: false,
    },
    function (err, res) {
      if (err) throw err;
    }
  );
  res.redirect("/");
});

app.get("/api/:id", function (req, res) {
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
    function (err, res) {
      if (err) throw err;
    }
  );
});

// delete route
app.delete("/api/food/:id", function (req, res) {
  connection.query("DELETE FROM food WHERE id = ?", [req.params.id], function (
    err,
    result
  ) {
    if (err) {
      // If an error occurred, send a generic server failure
      return res.status(500).end();
    } else if (result.affectedRows === 0) {
      // If no rows were changed, then the ID must not exist, so 404
      return res.status(404).end();
    }
    res.status(200).end();
  });
});

// Start our server so that it can begin listening to client requests.
app.listen(PORT, function () {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT);
});
