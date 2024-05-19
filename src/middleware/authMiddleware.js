"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
var verifyToken = function (req, res, next) {
    var token = req.cookies['auth_token'];
    if (!token)
        return res.status(401).json({ message: "unauthorized" });
    try {
        var decoded = jsonwebtoken_1.default.verify(token, 'jsonwebtokensecret');
        req.userId = decoded.userId;
        next();
    }
    catch (error) {
        res.status(401).json({ message: "unauthorized" });
    }
};
exports.verifyToken = verifyToken;
