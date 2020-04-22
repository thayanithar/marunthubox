const mongoose = require("mongoose");
var contact = require("./models/contact");
var checkout = require("./models/checkout");
var user = require("./models/user");
var photoupload = require("./models/photoupload");

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const path = require("path");
const fs = require("fs");

const mongodb = require("mongodb");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const binary = mongodb.Binary;

// prescription image upload
const Grid = require("gridfs-stream");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");

// app/routes.js

module.exports = function (app, passport, db) {
  // HOME PAGE (with login links) ========
  app.get("/", function (req, res) {
    res.render("index.ejs", {
      user: req.user,
    }); // load the index.ejs file
  });

  app.get("/contact", function (req, res) {
    res.render("contact.ejs", {
      user: req.user,
    });
    // load the index.ejs file
  });

  app.get("/auto", function (req, res) {
    res.render("auto.ejs", {
      user: req.user,
    });
    // load the index.ejs file
  });

  app.get("/shop", function (req, res) {
    res.render("shop.ejs", {
      user: req.user,
    });
    // load the index.ejs file
  });

  app.get("/profile", function (req, res) {
    res.render("profile.ejs", {
      user: req.user,
    });
    // load the index.ejs file
  });

  app.get("/photoupload", function (req, res) {
    res.render("photoupload.ejs", {
      user: req.user,
    });
    // load the index.ejs file
  });

  app.get("/shop-single", function (req, res) {
    res.render("shop-single.ejs", {
      user: req.user,
    });
    // load the index.ejs file
  });

  /////////////////////////////////////////////////////
  //=================================================
  app.get("/getBikes", (req, res) => {
    contact.find({}, function (err, result) {
      if (err) {
        res.send(err);
      } else {
        //contact page code blog.ejs
        res.send(result);
      }
    });
  });
  //=================================================
  app.get("/getMarunthu", (req, res) => {
    checkout.find({}, function (err, result) {
      if (err) {
        res.send(err);
      } else {
        //order page code shop-single.ejs
        res.send(result);
      }
    });
  });
  //==================================================
  app.get("/getRun", (req, res) => {
    user.find({}, function (err, result) {
      if (err) {
        res.send(err);
      } else {
        //signup page code auto.ejs
        res.send(result);
      }
    });
  });
  //===================================================
  app.get("/getSingle", (req, res) => {
    photoupload.find({}, function (err, result) {
      if (err) {
        res.send(err);
      } else {
        //photo upload page code shop.ejs
        res.send(result);
      }
    });
  });
  //==================================================
  ////////////////////////////////////////////////////

  app.get("/about", function (req, res) {
    res.render("about.ejs", {
      user: req.user,
    });
    // load the index.ejs file
  });

  app.get("/success1", function (req, res) {
    res.render("success1.ejs", {
      user: req.user,
    });
  });

  app.get("/success", function (req, res) {
    res.render("success.ejs", {
      user: req.user,
    });
  });

  app.get("/host", isLoggedIn, function (req, res) {
    res.render("host.ejs", {
      user: req.user,
    }); // load the index.ejs file
  });

  app.get("/checkout", isLoggedIn, function (req, res) {
    res.render("checkout.ejs", {
      user: req.user,
    });
  });

  app.get("/blog", function (req, res) {
    res.render("blog.ejs", {
      user: req.user,
    });
  });

  app.get("/checkout", isLoggedIn, function (req, res) {
    res.render("checkout.ejs", {
      user: req.user,
    });
  });

  // =====================================
  // LOGIN ===============================
  // =====================================
  // show the login form
  app.get("/login", function (req, res) {
    // render the page and pass in any flash data if it exists
    res.render("login.ejs", { message: req.flash("loginMessage") });
  });
  app.get("/booklogin", function (req, res) {
    // render the page and pass in any flash data if it exists
    res.render("booklogin.ejs", { message: req.flash("loginMessage") });
  });

  // process the login form

  // app.post('/login', do all our passport stuff here);
  // process the login form
  app.post(
    "/login",
    passport.authenticate("local-login", {
      successRedirect: "/", // redirect to the secure profile section
      failureRedirect: "/login", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    })
  );

  app.post(
    "/car/login",
    passport.authenticate("local-login", {
      successRedirect: "/host", // redirect to the secure profile section
      failureRedirect: "/login", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    })
  );
  // =====================================
  // SIGNUP ==============================
  // =====================================
  // show the signup form
  app.get("/signup", function (req, res) {
    res.render("signup.ejs", { message: req.flash("signupMessage") });
  });

  // process the signup form
  // app.post('/signup', do all our passport stuff here);
  app.post(
    "/signup",
    passport.authenticate("local-signup", {
      successRedirect: "/", // redirect to the secure profile section
      failureRedirect: "/signup", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    })
  );

  //======================================================================================================================================
  app.get("/checkout", function (req, res) {
    res.render("checkout.ejs", { message: req.flash("aaa") });
  });

  app.post(
    "/checkout.ejs",
    passport.authenticate("local-checkout", {
      successRedirect: "/success", // redirect to the secure profile section
      failureRedirect: "/checkout", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    })
  );

  //================================================================================================================================================

  // =====================================
  // PROFILE SECTION =====================
  // =====================================
  // we will want this protected so you have to be logged in to visit
  // we will use route middleware to verify this (the isLoggedIn function)
  app.get("/profile", isLoggedIn, function (req, res) {
    res.render("profile.ejs", {
      user: req.user, // get the user out of session and pass to template
    });
  });

  // =====================================
  // FACEBOOK ROUTES =====================
  // =====================================
  // route for facebook authentication and login
  app.get(
    "/auth/facebook",
    passport.authenticate("facebook", {
      scope: ["public_profile", "email"],
    })
  );

  // handle the callback after facebook has authenticated the user
  app.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook", {
      successRedirect: "/",
      failureRedirect: "/login",
      failureFlash: true, // allow flash messages
    })
  );

  // =====================================
  // GOOGLE ROUTES =======================
  // =====================================
  // send to google to do the authentication
  // profile gets us their basic information including their name
  // email gets their emails
  app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  // the callback after google has authenticated the user
  app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      successRedirect: "/",
      failureRedirect: "/login",
      failureFlash: true, // allow flash messages
    })
  );

  // =====================================
  // TWITTER ROUTES ======================
  // =====================================
  // route for twitter authentication and login
  app.get("/auth/twitter", passport.authenticate("twitter"));

  // handle the callback after twitter has authenticated the user
  app.get(
    "/auth/twitter/callback",
    passport.authenticate("twitter", {
      successRedirect: "/",
      failureRedirect: "/login",
      failureFlash: true, // allow flash messages
    })
  );

  // =====================================
  // LOGOUT ==============================
  // =====================================
  app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
  });

  //=======================================================================================================================
  app.post("/contact", function (req, res) {
    var newcontact = new contact();
    newcontact.name = req.body.name;
    newcontact.email = req.body.email;
    newcontact.subject = req.body.subject;
    newcontact.message = req.body.message;
    newcontact.number = req.body.number;

    newcontact.save(function (err, newcontact) {
      if (err) {
        res.redirect("/contact");
        console.log(err);
      } else {
        res.redirect("/success1");
        console.log(" contact Document Save Done");
      }
    });
  });

  //=========================================================================================================================
  app.post("/checkout", function (req, res) {
    var newcheckout = new checkout();
    newcheckout.firstname = req.body.firstname;
    newcheckout.lastname = req.body.lastname;
    newcheckout.email = req.body.email;
    newcheckout.address = req.body.address;
    newcheckout.phonenumber = req.body.phonenumber;
    newcheckout.notes = req.body.notes;

    newcheckout.mealsname = req.body.mealsname;
    newcheckout.mealsprice = req.body.mealsprice;
    newcheckout.mealsvalue = req.body.mealsvalue;
    newcheckout.mealstotal = req.body.mealstotal;

    newcheckout.save(function (err, newcheckout) {
      if (err) {
        res.redirect("/checkout");
        console.log(err);
      } else {
        res.redirect("/success");
        console.log(" checkout Document Save Done");
      }
    });
  });
  //==========================================================================================================================
  app.post("/photoupload", function (req, res) {
    var newphotoupload = new photoupload();
    newphotoupload.photos = req.body.photos;
    newphotoupload.pnames = req.body.pnames;
    newphotoupload.prices = req.body.prices;

    newphotoupload.save(function (err, newphotoupload) {
      if (err) {
        res.redirect("/photoupload");
        console.log(err);
      } else {
        res.redirect("/shop");
        console.log(" photo Document upload Done");
      }
    });
  });
  //=========================================================================================================================

  app.post("/host", function (req, res) {
    var newhost = new host();

    newhost.c_fname = req.body.c_fname;
    newhost.c_lname = req.body.c_lname;
    newhost.c_address = req.body.c_address;
    newhost.c_email_address = req.body.c_email_address;
    newhost.c_phone = req.body.c_phone;
    newhost.c_order_notes = req.body.c_order_notes;

    //send mail to us when order comes
    var nodemailer = require("nodemailer");

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "nitharthaya123@gmail.com",
        pass: "nithar1234",
      },
    });
    var user = req.user;
    var name = user.local.lastname;
    const mailOptions = {
      from: "nitharthaya123@gmail.com", // sender address
      to: "nitharthaya123@gmail.com", // list of receivers
      subject: " New Marunthu.Box Registration Details", // Subject line
      html:
        '<div style="background-color:#eeeeef;padding:50px 0"><table style="width:540px" border="0" cellspacing="0" cellpadding="0" align="center"><tbody><tr><td style="padding:40px 30px 30px 30px" align="center" bgcolor="#33333e"><h1 style="color:#fff">Team Marunthu.Box,<br>Register Successfully. </h1></td></tr><tr><td bgcolor="#ffffff" style="padding:40px 30px 40px 30px"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td width="260" valign="top"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td>Hello ' +
        name +
        '! We got a Oder  from you. please check in your dashboard</td></tr><tr><td style="padding:10px 0 0 0">Two wheeler id: ' +
        newhost.carId +
        '</td></tr><tr><td style="padding:10px 0 0 0">First name: ' +
        user.local.firstname +
        '</td></tr><tr><td style="padding:10px 0 0 0">Last name: ' +
        user.local.lastname +
        '</td></tr><tr><td style="padding:10px 0 0 0">Email: ' +
        newhost.email +
        ' </td> </tr><tr><td style="padding:10px 0 0 0">Phone number: ' +
        newhost.phonenumber +
        '</td></tr><tr><td style="padding:10px 0 0 0">Address: ' +
        newhost.address +
        '</td></tr><tr><td style="padding:10px 0 0 0">Nic/passport: ' +
        newhost.nic +
        '</td></tr><tr><td style="padding:10px 0 0 0">From this date: ' +
        newhost.fdate +
        '</td></tr><tr><td style="padding:10px 0 0 0">Until this date: ' +
        newhost.udate +
        '</td></tr></tbody></table></td></tr></tbody></table></td></tr><tr><td align="center" bgcolor="#fff"><h3>Thank you<br/>Fernweh Team</h3></td></tr><tr><td style="background-color:#ffffff;padding:30px 30px 30px 30px"><table border="0" width="100%" cellspacing="0" cellpadding="0"><tbody><tr><td style="font-family:Arial,sans-serif;font-size:14px">® Fernweh, 2019</td></tr></tbody></table></td></tr></tbody></table></div>', // plain text body
    };
    transporter.sendMail(mailOptions, function (err, info) {
      if (err) console.log(err);
      else console.log(info);
    });

    newhost.save(function (err, newhost) {
      if (err) {
        res.redirect("/host");
        console.log(err);
      } else {
        res.redirect("/success");
        console.log("Document Save Done");

        //send mail to customer
        var nodemailer = require("nodemailer");

        var transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "nitharthaya123@gmail.com",
            pass: "nithar1234",
          },
        });
        var user = req.user;

        const mailOptions = {
          from: "nitharthaya123@gmail.com", // sender address
          to: user.local.email, // list of receivers
          subject: "Marunthu.Box Registration Details", // Subject line
          html:
            '<div style="background-color:#eeeeef;padding:50px 0"><table style="width:540px" border="0" cellspacing="0" cellpadding="0" align="center"><tbody><tr><td style="padding:10px 30px 10px 30px" align="center" bgcolor="#33333e"><h1 style="color:#fff">Hi ' +
            user.local.lastname +
            ',</h1><h2 style="color:#fff">Your order has been placed successfully. We will contact you about the order as soon as possible. </h2></td></tr><tr><td bgcolor="#ffffff" style="padding:40px 30px 10px 30px"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td width="260" valign="top"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td>This is a system generated email and please do not reply. For more information please contact to +94 76 025 3735 .</td></tr><h3 style="text-align:center;">  Order Deatils </h3><tr><td style="padding:10px 0 0 0">  </td></tr><tr><td style="padding:10px 0 0 0">First name: ' +
            user.local.firstname +
            '</td></tr><tr><td style="padding:10px 0 0 0">Last name: ' +
            user.local.lastname +
            '</td></tr><tr><td style="padding:10px 0 0 0">Email: ' +
            newhost.email +
            '</td></tr><tr><td style="padding:10px 0 0 0">Phone number: ' +
            newhost.phonenumber +
            '</td></tr><tr><td style="padding:10px 0 0 0">Address: ' +
            newhost.address +
            '</td></tr><tr><td style="padding:10px 0 0 0">Nic/passport: ' +
            newhost.nic +
            '</td></tr><tr><td style="padding:10px 0 0 0">From this date: ' +
            newhost.fdate +
            '</td></tr><tr><td style="padding:10px 0 0 0">Until this date: ' +
            newhost.udate +
            '</td></tr></tbody></table></td></tr></tbody></table></td></tr><tr><td align="center" bgcolor="#fff"><h3>Thank you<br/>Fernweh Team</h3></td></tr><tr><td style="background-color:#33333d;padding:20px 30px 20px 30px"><table border="0" width="100%" cellspacing="0" cellpadding="0"><tbody><tr><td style="font-family:Arial,sans-serif;font-size:14px;color:#fff">® Marunthu.Box, 2019</td></tr></tbody></table></td></tr></tbody></table></div>', // plain text body
        };
        transporter.sendMail(mailOptions, function (err, info) {
          if (err) console.log(err);
          else console.log(info);
        }); // load the index.ejs file
      }
    });
  });

  app.get("/prescription", (req, res) => {
    res.render("prescription");
  });
  //============================================================================
  // start prescription image upload
  var URL = "mongodb://localhost:27017/final";
  const storage = new GridFsStorage({
    url: URL,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        const filename = file.originalname;
        const fileInfo = {
          filename: filename,
          bucketName: "prescription",
          metadata: req.body,
        };
        resolve(fileInfo);
      });
    },
  });
  const upload = multer({ storage });

  app.post("/prescription", upload.single("file"), (req, res) => {
    res.redirect("/prescription");
  });

  // ====================================================
  // View the prescription files
  // Code by Piruthuvi
  // ====================================================
  const mongoURI = "mongodb://localhost:27017/final";

  // Create mongo connection
  const conn = mongoose.createConnection(mongoURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  // Init gfs
  let gfs;

  conn.once("open", () => {
    // Init stream
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("prescription");
  });

  // @route GET /
  // @desc Loads form
  app.get("/prescription_image_get", (req, res) => {
    gfs.files.find().toArray((err, files) => {
      // Check if files
      if (!files || files.length === 0) {
        res.render("prescription_image_get", { files: false });
      } else {
        files.map((file) => {
          if (
            file.contentType === "image/jpeg" ||
            file.contentType === "image/png"
          ) {
            file.isImage = true;
          } else {
            file.isImage = false;
          }
        });
        res.render("prescription_image_get", { files: files });
      }
    });
  });

  // @desc  Display single file object
  app.get("/files/:filename", (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
      // Check if file
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: "No file exists",
        });
      }
      // File exists
      const readstream = gfs.createReadStream(file.filename);
      return readstream.pipe(res);
    });
  });

  // @desc Display Image
  app.get("/image/:filename", (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
      // Check if file
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: "No file exists",
        });
      }

      // Check if image
      if (
        file.contentType === "image/jpeg" ||
        file.contentType === "image/png"
      ) {
        // Read output to browser
        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
      } else {
        res.status(404).json({
          err: "Not an image",
        });
      }
    });
  });

  // @route DELETE /files/:id
  // @desc  Delete file
  app.delete("/files/:id", (req, res) => {
    gfs.remove(
      { _id: req.params.id, root: "prescription" },
      (err, gridStore) => {
        if (err) {
          return res.status(404).json({ err: err });
        }

        res.redirect("/prescription_image_get");
      }
    );
  });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()) return next();

  // if they aren't redirect them to the home page
  res.redirect("/login");
}
