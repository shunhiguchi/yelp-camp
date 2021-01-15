const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejs = require("ejs");

const Campground = require("./models/campground.js");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Established connection to database")
});

app.get("/", (req, res) => {
    console.log("Hello from YelpCamp!");
})

app.get("/makecampground", async (req, res) => {
    const camp = new Campground({title: "My Backyard", description: "Cheap camping"});
    await camp.save();
    res.send(camp);
})

app.listen(3000, () => {
    console.log("Serving on port 3000");
})