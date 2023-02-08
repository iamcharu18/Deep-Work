const express = require("express");
const nodemailer = require("nodemailer");

const app = express();

require('dotenv').config();

const user = process.env.USER;
const pass = process.env.PASSWORD;

app.use('/assets', express.static('assets'))
app.use('/services/assets', express.static('assets'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//setting view engine to ejs
app.set("view engine", "ejs");

app.listen(process.env.PORT || 3000, () => {
    console.log("Server running at http://localhost:3000/");
});

//route for index page
app.get("/", function (req, res) {
    res.render("index", {
        title: "Deepwork",
    });
});

//route for about page
app.get("/about", function (req, res) {
    res.render("about", {
        title: "About",
    });
});

//route for services page
app.get("/services", function (req, res) {
    res.render("services", {
        title: "Services",
    });
});

//route for contact page
app.get("/contact", function (req, res) {
    res.render("contact", {
        title: "Contact",
    });
});

// route for sending mail
app.post("/sendmail", function (req, res) {
    // console.log(req.body);
    const { name, email, subject, message } = req.body;
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user,
            pass
        },
    });
    const mailOptions = {
        from: "sobhansai03@gmail.com",
        to: "sobhansaikuriti03@gmail.com",
        subject: `New Contact Sent from website`,
        html: `<h1>${subject}</h1><p>${name}</p><p>${email}</p><p>${message}</p>`
    };
    transporter.sendMail(mailOptions, (error, response) => {
        if (error) {
            console.log(error);
            res.send("error")
        } else {
            console.log("Email Sent");
            res.send("success")
        }
    });
})

//route for individual services
app.get("/services/accounting-service", function (req, res) {
    res.render("services/accounting", {
        title: "Accounting Service",
    });
});

app.get("/services/bookkeeping-service", function (req, res) {
    res.render("services/bookkeeping", {
        title: "Bookkeeping Service",
    });
});

module.exports = app;