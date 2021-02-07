const express = require("express");
const router = express.Router();
const passport = require("passport");

const User = require("../models/users.js");
const catchAsync = require("../utils/catchAsync.js");
const users = require("../controllers/users.js");

router.route("/register")
    .get(users.renderRegister)
    .post(catchAsync(users.register));

router.route("/login")
    .get(users.renderLogin)
    .post(passport.authenticate("local", {failureFlash: true, failureRedirect: "/login"}), users.login);

router.get("/logout", users.logout);

module.exports = router;