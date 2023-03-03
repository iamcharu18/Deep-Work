const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer");

const app = express();

require('dotenv').config();

const user = process.env.USER;
const pass = process.env.PASSWORD;

app.use('/assets', express.static(path.join(__dirname, 'assets')))
app.use('/services/assets', express.static(path.join(__dirname, 'assets')))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//setting view engine to ejs
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

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
    const { name, email, subject, message, phone, category } = req.body;
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
        html: `<h2>Subject : ${subject}</h2><p>Name : ${name}</p><p>Email : ${email}</p><p>Phone : ${phone}</p><p>Category : ${category}</p><p>Message : ${message}</p>`
    };
    transporter.sendMail(mailOptions, (error, response) => {
        if (error) {
            console.log(error);
            res.status(400);
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

app.get("/services/legal-compliances", function (req, res) {
    res.render("services/legal-compliance", {
        title: "Legal Compliances",
    });
});

app.get("/services/statutory-compliances", function (req, res) {
    res.render("services/statutory-compliance", {
        title: "Statutory Compliances",
    });
});

app.get("/services/ipr-service", function (req, res) {
    res.render("services/ipr", {
        title: "IPR Service",
    });
});

app.get("/services/payroll-service", function (req, res) {
    res.render("services/payroll-outsourcing", {
        title: "Payroll Outsourcing",
    });
});

app.get("/services/monthly-compliances", function (req, res) {
    res.render("services/monthly-compliance", {
        title: "Monthly Compliance",
    });
});

app.get("/services/labour-compliances", function (req, res) {
    res.render("services/labour-compliance", {
        title: "Labour Compliance",
    });
});

app.get("/services/valuation-service", function (req, res) {
    res.render("services/business-valuation", {
        title: "Business Valuation",
    });
});

app.get("/home-2", function (req, res) {
    res.render("home.ejs", {
        title: "Second Home",
    });
})

app.get("*", function (req, res) {
    res.render("404", {
        title: "Error",
    });
});

module.exports = app;