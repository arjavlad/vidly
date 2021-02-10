const express = require("express");
const home = express.Router();

home.get("/", (req, res) => {
  res.render("index", {
    title: "My Express App",
    message: "Hi!!!",
  });
});

module.exports = home;