const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejs = require("ejs");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");

const Campground = require("./models/campground.js");
const ExpressError = require("./utils/ExpressError.js");
const {campgroundSchema, reviewSchema} = require("./schemas.js")
const Review = require("./models/review.js");

const campgrounds = require("./routes/campgrounds.js");
const reviews = require("./routes/reviews.js");

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Established connection to database")
});

const validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body);
    if (error)
    {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    }
    next();
}

const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if (error)
    {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    }
    next();
}

app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/reviews", reviews);
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    console.log("Hello from YelpCamp!");
})





app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
})

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if (!err.message)
    {
        err.message = "Oh no, something went wrong.";
    }
    res.status(statusCode).render("error", {err});
})

app.listen(3000, () => {
    console.log("Serving on port 3000");
})