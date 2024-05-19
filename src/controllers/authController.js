"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.validateToken = exports.logout = exports.login = exports.register = void 0;
var userModel_1 = require("../models/userModel");
var express_validator_1 = require("express-validator");
var jsonwebtoken_1 = require("jsonwebtoken");
var bcryptjs_1 = require("bcryptjs");
var getUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, user, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.userId;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, userModel_1.default.findById(userId).select("-password")];
            case 2:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ message: "User not found" })];
                }
                res.json(user);
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.log(error_1);
                res.status(500).json({ message: "Something went wrong" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getUser = getUser;
var register = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, email, user, token, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ message: errors.array() })];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                email = req.body.email;
                return [4 /*yield*/, userModel_1.default.findOne({ email: email })];
            case 2:
                user = _a.sent();
                if (user) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ message: "User with email already registered" })];
                }
                user = new userModel_1.default(req.body);
                return [4 /*yield*/, user.save()];
            case 3:
                _a.sent();
                console.log(user);
                token = jsonwebtoken_1.default.sign({ userId: user._id }, "jsonwebtokensecret", {
                    expiresIn: "1d",
                });
                res.cookie("auth_token", token, {
                    httpOnly: true,
                    secure: false,
                    maxAge: 86400000,
                });
                res.status(200).json({ message: "User registered successfully" });
                return [3 /*break*/, 5];
            case 4:
                error_2 = _a.sent();
                res.status(500).json({ message: "error while registering user" });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.register = register;
var login = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var erros, _a, email, password, user, isMatch, token, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                erros = (0, express_validator_1.validationResult)(req);
                if (!erros.isEmpty()) {
                    res.status(400).json({ message: erros.array() });
                }
                _a = req.body, email = _a.email, password = _a.password;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, userModel_1.default.findOne({ email: email })];
            case 2:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ message: "Invalid credentials" })];
                }
                return [4 /*yield*/, bcryptjs_1.default.compare(password, user.password)];
            case 3:
                isMatch = _b.sent();
                if (!isMatch) {
                    return [2 /*return*/, res.status(404).json({ message: "Invalid credentials" })];
                }
                token = jsonwebtoken_1.default.sign({ userId: user._id }, "jsonwebtokensecret", {
                    expiresIn: "1d",
                });
                res.cookie("auth_token", token, {
                    httpOnly: true,
                    secure: true,
                    maxAge: 86400000,
                });
                res.status(200).json({ message: user._id });
                return [3 /*break*/, 5];
            case 4:
                error_3 = _b.sent();
                console.log(error_3);
                res.status(500).json({ message: "error while logging in" });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.login = login;
var logout = function (req, res) {
    res.cookie("auth_token", "", {
        expires: new Date(0),
    });
    res.status(200).json({ message: "Signed Out Successfully" });
};
exports.logout = logout;
var validateToken = function (req, res) {
    res.status(200).json({ userId: req.userId });
};
exports.validateToken = validateToken;
