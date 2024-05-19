"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var authController_1 = require("../controllers/authController");
var express_validator_1 = require("express-validator");
var authMiddleware_1 = require("../middleware/authMiddleware");
var router = express_1.default.Router();
router.post("/register", [
    (0, express_validator_1.check)("firstName", "firstName is Required").isString(),
    (0, express_validator_1.check)("lastName", "lastName is Required").isString(),
    (0, express_validator_1.check)("email", "email is Required").isEmail(),
    (0, express_validator_1.check)("password", "password with minimun 6 or more characters").isLength({
        min: 6,
    })
], authController_1.register);
router.post("/signIn", [
    (0, express_validator_1.check)("email", "email is Required").isEmail(),
    (0, express_validator_1.check)("password", "password with minimun 6 or more characters").isLength({
        min: 6,
    })
], authController_1.login);
router.post("/signOut", [
    (0, express_validator_1.check)("email", "email is Required").isEmail(),
    (0, express_validator_1.check)("password", "password with minimun 6 or more characters").isLength({
        min: 6,
    })
], authController_1.logout);
router.get("/validateToken", authMiddleware_1.verifyToken, authController_1.validateToken);
router.get("/getUser", authMiddleware_1.verifyToken, authController_1.getUser);
exports.default = router;
