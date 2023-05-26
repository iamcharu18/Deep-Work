const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');

const authenticateToken = (request, response, next) => {
    let jwtToken;
    const authHeader = request.headers["cookie"];
    if (authHeader !== undefined) {
        const tokenIndex = authHeader.indexOf("token=");
        const tokenEndIndex = authHeader.indexOf(";", tokenIndex);
        if (tokenEndIndex !== -1) {
            jwtToken = authHeader.substring(tokenIndex + 6, tokenEndIndex);
        }
        else {
            jwtToken = authHeader.substring(tokenIndex + 6);
        }
    }
    if (jwtToken === undefined) {
        response.redirect("/admin/login");
    } else {
        jwt.verify(jwtToken, process.env.JWT_SECRET, async (error, payload) => {
            if (error) {
                response.redirect("/admin/login");
            } else {
                const admin = await Admin.findOne({
                    where: { username: payload.username },
                    attributes: ['username']
                });
                if (!admin) {
                    response.redirect("/admin/login");
                }
                request.username = payload.username;
                request.message = "logged";
                next();
            }
        });
    }
};

module.exports = authenticateToken;