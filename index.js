const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

app.listen(3000, () => {
    console.log("Serving on port 3000");
})