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
app.get("/services/accounting-and-bookkeeping-service", function (req, res) {
    res.render("services/1-accounting-and-bookkeeping", {
        title: "Accounting and Book Keeping Service",
    });
});

app.get("/services/gst-service", function (req, res) {
    res.render("services/2-gst", {
        title: "GST Services",
    });
});

app.get("/services/it-returns", function (req, res) {
    res.render("services/3-income-tax", {
        title: "Income Tax returns",
    });
});

app.get("/services/payroll-management", function (req, res) {
    res.render("services/4-payroll-management", {
        title: "Payroll Management",
    });
});

app.get("/services/corporate-secretarial", function (req, res) {
    res.render("services/5-corporate-secretarial", {
        title: "Corporate Secretarial",
    });
});

app.get("/services/statutory-and-other-compliances", function (req, res) {
    res.render("services/6-statutory-and-other-compliance", {
        title: "Statutory & other Compliances",
    });
});

app.get("/services/outsourcing", function (req, res) {
    res.render("services/7-outsourcing", {
        title: "Outsourcing",
    });
});

app.get("/services/cost-and-works-compliance", function (req, res) {
    res.render("services/8-cost-and-works-compliances", {
        title: "Cost and Works Compliance",
    });
});

// PENDING?
// app.get("/services/startup", function (req, res) {
//     res.render("services/8-cost-and-works-compliances", {
//         title: "Cost and Works Compliance",
//     });
// });

app.get("/services/business-valuation", function (req, res) {
    res.render("services/10-business-valuation", {
        title: "Business Valuation",
    });
});

app.get("/services/ipr-service", function (req, res) {
    res.render("services/11-ipr", {
        title: "IPR Service",
    });
});

app.get("/services/mergers-and-aquisitions", function (req, res) {
    res.render("services/12-mergers-and-aquisitions", {
        title: "Mergers and Aquisitions",
    });
});

app.get("/startup/private-limited-company-registration", function (req, res) {
    res.render("startup/private-limited-company-registration", {
        title: "Private Limited Company Registration",
    });
});

app.get("/startup/llp-company-registration", function (req, res) {
    res.render("startup/llp-company-registration", {
        title: "Limited Liability Partnership Company Registration",
    });
});

app.get("/startup/opc-registration", function (req, res) {
    res.render("startup/opc-registration", {
        title: "One-Person Company (OPC) Registration",
    });
});

app.get("/startup/ngo-registration", function (req, res) {
    res.render("startup/ngo-registration", {
        title: "NGO/Section 8 Company Registration",
    });
});


app.get("/services/legal-compliances", function (req, res) {
    res.render("services/legal-compliance", {
        title: "Legal Compliances",
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