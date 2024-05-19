"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHotelDetails = exports.searchHotel = exports.updateHotelById = exports.getHotelById = exports.getMyHotels = exports.addHotel = exports.createBooking = exports.createPaymentIntent = void 0;
var hotelModel_1 = require("../models/hotelModel");
var express_validator_1 = require("express-validator");
var stripe_1 = require("stripe");
var STRIPE_API_KEY = process.env.STRIPE_API_KEY;
var stripe = new stripe_1.default(STRIPE_API_KEY);
var createPaymentIntent = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var numberOfNights, hotelId, hotel, totalCost, paymentIntent, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                numberOfNights = req.body.numberOfNights;
                hotelId = req.params.hotelId;
                return [4 /*yield*/, hotelModel_1.default.findById(hotelId)];
            case 1:
                hotel = _a.sent();
                if (!hotel) {
                    return [2 /*return*/, res.status(404).json({ message: "Hotel not found" })];
                }
                totalCost = hotel.pricePerNight * numberOfNights;
                return [4 /*yield*/, stripe.paymentIntents.create({
                        amount: totalCost,
                        currency: "INR",
                        metadata: {
                            hotelId: hotelId,
                            userId: req.userId,
                        },
                    })];
            case 2:
                paymentIntent = _a.sent();
                if (!paymentIntent.client_secret) {
                    return [2 /*return*/, res.status(500).json({ message: "Error creating payment intent" })];
                }
                response = {
                    paymentIntentId: paymentIntent.id,
                    clientSecret: paymentIntent.client_secret.toString(),
                    totalCost: totalCost,
                };
                res.status(200).json(response);
                return [2 /*return*/];
        }
    });
}); };
exports.createPaymentIntent = createPaymentIntent;
var createBooking = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var paymentIntentId, paymentIntent, newBooking, hotel, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                paymentIntentId = req.body.paymentIntentId;
                return [4 /*yield*/, stripe.paymentIntents.retrieve(paymentIntentId)];
            case 1:
                paymentIntent = _a.sent();
                if (!paymentIntent)
                    return [2 /*return*/, res.status(400).json({ message: "paymentIntent not found" })];
                if (paymentIntent.metadata.hotelId !== req.params.hotelId || paymentIntent.metadata.userId !== req.userId)
                    return [2 /*return*/, res.status(400).json({ message: "paymentIntent mismatch" })];
                if (paymentIntent.status !== "succeeded") {
                    return [2 /*return*/, res
                            .status(400)
                            .json({
                            message: "paymentIntent not succeeded status:".concat(paymentIntent.status),
                        })];
                }
                newBooking = __assign(__assign({}, req.body), { userId: req.userId });
                return [4 /*yield*/, hotelModel_1.default.findOneAndUpdate({
                        _id: req.params.id,
                    }, {
                        $push: { bookings: newBooking }
                    })];
            case 2:
                hotel = _a.sent();
                if (!hotel) {
                    return [2 /*return*/, res.status(400).json({ message: "hotel not found" })];
                }
                return [4 /*yield*/, hotel.save()];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                error_1 = _a.sent();
                console.log(error_1);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.createBooking = createBooking;
var addHotel = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, name, city, country, description, type, adultCount, childCount, facilities, pricePerNight, starRating, imageUrls, lastUpdated, hotel, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = req.userId;
                _a = req.body, name = _a.name, city = _a.city, country = _a.country, description = _a.description, type = _a.type, adultCount = _a.adultCount, childCount = _a.childCount, facilities = _a.facilities, pricePerNight = _a.pricePerNight, starRating = _a.starRating;
                imageUrls = req.uploadedImageUrls;
                lastUpdated = new Date();
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                hotel = new hotelModel_1.default({
                    userId: userId,
                    name: name,
                    city: city,
                    country: country,
                    description: description,
                    type: type,
                    adultCount: adultCount,
                    childCount: childCount,
                    facilities: facilities,
                    pricePerNight: pricePerNight,
                    starRating: starRating,
                    imageUrls: imageUrls,
                    lastUpdated: lastUpdated,
                });
                return [4 /*yield*/, hotel.save()];
            case 2:
                _b.sent();
                res.status(200).json({ message: "Hotel Added successfully", hotel: hotel });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _b.sent();
                console.log(error_2);
                res.status(500).json({ message: "Error while adding Hotel" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.addHotel = addHotel;
var getMyHotels = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, hotels, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.userId;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, hotelModel_1.default.find({ userId: userId })];
            case 2:
                hotels = _a.sent();
                res.status(200).json({ hotels: hotels });
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                console.log(error_3);
                res.status(500).json({ message: "Error while getting Hotels" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getMyHotels = getMyHotels;
var getHotelById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, hotel, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id.toString();
                console.log(id);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, hotelModel_1.default.findOne({
                        _id: id,
                        userId: req.userId,
                    })];
            case 2:
                hotel = _a.sent();
                console.log(hotel);
                res.status(200).json(hotel);
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                res.status(500).json({ message: "Error while getting hotel" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getHotelById = getHotelById;
var updateHotelById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var hotelId, userId, _a, name, city, country, description, type, adultCount, childCount, facilities, pricePerNight, starRating, imageUrls, lastUpdated, updatedHotel, hotel, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                hotelId = req.body.hotelId;
                userId = req.userId;
                _a = req.body, name = _a.name, city = _a.city, country = _a.country, description = _a.description, type = _a.type, adultCount = _a.adultCount, childCount = _a.childCount, facilities = _a.facilities, pricePerNight = _a.pricePerNight, starRating = _a.starRating;
                imageUrls = __spreadArray(__spreadArray([], (req.body.imageUrls || []), true), (req.uploadedImageUrls || []), true);
                lastUpdated = new Date();
                updatedHotel = {
                    name: name,
                    city: city,
                    country: country,
                    description: description,
                    type: type,
                    adultCount: adultCount,
                    childCount: childCount,
                    facilities: facilities,
                    pricePerNight: pricePerNight,
                    starRating: starRating,
                    imageUrls: imageUrls,
                    lastUpdated: lastUpdated,
                };
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, hotelModel_1.default.findByIdAndUpdate({ _id: hotelId, userId: userId }, updatedHotel, { new: true })];
            case 2:
                hotel = _b.sent();
                res.status(200).json(hotel);
                return [3 /*break*/, 4];
            case 3:
                error_5 = _b.sent();
                res.status(500).json({ message: "Error while updating hotel" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.updateHotelById = updateHotelById;
var constructSearchQuery = function (queryParams) {
    var constructedQuery = {};
    if (queryParams.destination) {
        constructedQuery.$or = [
            { city: new RegExp(queryParams.destination, "i") },
            { country: new RegExp(queryParams.destination, "i") },
        ];
    }
    if (queryParams.adultCount) {
        constructedQuery.adultCount = {
            $gte: parseInt(queryParams.adultCount),
        };
    }
    if (queryParams.childCount) {
        constructedQuery.childCount = {
            $gte: parseInt(queryParams.childCount),
        };
    }
    if (queryParams.facilities) {
        constructedQuery.facilities = {
            $all: Array.isArray(queryParams.facilities)
                ? queryParams.facilities
                : [queryParams.facilities],
        };
    }
    if (queryParams.types) {
        constructedQuery.type = {
            $in: Array.isArray(queryParams.types)
                ? queryParams.types
                : [queryParams.types],
        };
    }
    if (queryParams.stars) {
        var starRatings = Array.isArray(queryParams.stars)
            ? queryParams.stars.map(function (star) { return parseInt(star); })
            : parseInt(queryParams.stars);
        constructedQuery.starRating = { $in: starRatings };
    }
    if (queryParams.maxPrice) {
        constructedQuery.pricePerNight = {
            $lte: parseInt(queryParams.maxPrice).toString(),
        };
    }
    return constructedQuery;
};
var searchHotel = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var query, sortOptions, pageSize, pageNumber, skip, hotels, total, response, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                query = constructSearchQuery(req.query);
                sortOptions = {};
                switch (req.query.sortOption) {
                    case "starRating":
                        sortOptions = { starRating: -1 };
                        break;
                    case "pricePerNightAsc":
                        sortOptions = { pricePerNight: 1 };
                        break;
                    case "pricePerNightDesc":
                        sortOptions = { pricePerNight: -1 };
                        break;
                }
                pageSize = 5;
                pageNumber = parseInt(req.query.page ? req.query.page.toString() : "1");
                skip = (pageNumber - 1) * pageSize;
                return [4 /*yield*/, hotelModel_1.default.find(query)
                        .sort(sortOptions)
                        .skip(skip)
                        .limit(pageSize)];
            case 1:
                hotels = _a.sent();
                return [4 /*yield*/, hotelModel_1.default.countDocuments()];
            case 2:
                total = _a.sent();
                response = {
                    data: hotels,
                    pagination: {
                        total: total,
                        page: pageNumber,
                        pages: Math.ceil(total / pageSize),
                    },
                };
                res.status(200).json(response);
                return [3 /*break*/, 4];
            case 3:
                error_6 = _a.sent();
                console.log(error_6);
                res.status(500).json({ message: "Error while searching hotel" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.searchHotel = searchHotel;
var getHotelDetails = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, id, hotel, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                id = req.params.id.toString();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, hotelModel_1.default.findById(id)];
            case 2:
                hotel = _a.sent();
                res.json(hotel);
                return [3 /*break*/, 4];
            case 3:
                error_7 = _a.sent();
                console.log(error_7);
                res.status(500).json({ message: "Error fetching hotel" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getHotelDetails = getHotelDetails;
