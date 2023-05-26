const express = require("express");
const path = require("path");
// const bodyParser = require('body-parser');

const sequelize = require("./utils/database");

const indexRouter = require("./routes/index");
const servicesRouter = require("./routes/services");
const startupRouter = require("./routes/startup");
const adminRouter = require("./routes/admin");

const app = express();

require('dotenv').config();

app.use('/assets', express.static(path.join(__dirname, 'assets')))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//setting view engine to ejs
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

const initializeDBAndServer = async () => {
    try {
        await sequelize.sync();
        app.listen(process.env.PORT || 3000, () => {
            console.log("Server running at http://localhost:3000/");
        });
    } catch (error) {
        console.log(`DB Error: ${error.message}`);
        process.exit(1);
    }
};

initializeDBAndServer();

// USER
app.use("/", indexRouter);
app.use("/services", servicesRouter);
app.use("/startup", startupRouter);
app.use("/admin", adminRouter);

// route for error pages
app.get("*", function (req, res) {
    res.render("404", {
        title: "Page not found",
    });
})

module.exports = app;