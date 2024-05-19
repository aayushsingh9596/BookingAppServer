"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = require("cors");
var db_1 = require("./db/db");
var authRoutes_1 = require("./routes/authRoutes");
var hotelRoutes_1 = require("./routes/hotelRoutes");
var cookie_parser_1 = require("cookie-parser");
var app = (0, express_1.default)();
(0, db_1.default)();
app.use((0, cors_1.default)({
    // origin: "http://localhost:5173",
    credentials: true
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api/test", function (req, res) {
    res.status(200).json({ message: "everything is fine" });
});
app.use('/api/auth', authRoutes_1.default);
app.use('/api/hotel', hotelRoutes_1.default);
app.listen(
// process.env.PORT,
3000, function () {
    console.log("listening on port", 3000);
});
