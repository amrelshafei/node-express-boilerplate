require("dotenv").config();
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const { createAPIRouter } = require("./router");

// Creating an Express application.
const app = express();
// Running the server on the given port.
const port = process.env.PORT || 5000;
app.listen(port, function () {
  console.log("[MESSAGE LOG] server is listening on Port: " + port);
});
// Mounting middleware.
app.use(bodyParser.json());
app.use(cors());
app.use(
  morgan(
    "[REQUEST LOG] :method :url :status :res[content-length] - :response-time ms"
  )
);
// Mounting all the resource route handlers to the application.
app.use(createAPIRouter());
// Mounting the client side.
app.use(express.static(path.join(process.cwd(), "client")));
app.get("/*", function (req, res) {
  res.sendFile(path.join(process.cwd(), "client", "index.html"));
});
