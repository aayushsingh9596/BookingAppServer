"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var multer_1 = require("multer");
var authMiddleware_1 = require("../middleware/authMiddleware");
var express_validator_1 = require("express-validator");
var hotelController_1 = require("../controllers/hotelController");
var uploadImagesToCloudinary_1 = require("../cloudinary/uploadImagesToCloudinary");
var router = express_1.default.Router();
var storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "../../images/hotelImages");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
var upload = (0, multer_1.default)({ storage: storage });
router.post("/addHotel", authMiddleware_1.verifyToken, [
    (0, express_validator_1.body)("name").notEmpty().withMessage("Name is required"),
    (0, express_validator_1.body)("city").notEmpty().withMessage("city is required"),
    (0, express_validator_1.body)("country").notEmpty().withMessage("country is required"),
    (0, express_validator_1.body)("description").notEmpty().withMessage("description is required"),
    (0, express_validator_1.body)("type").notEmpty().withMessage("Hotel type is required"),
    (0, express_validator_1.body)("pricePerNight")
        .notEmpty()
        .isNumeric()
        .withMessage("pricePerNigh is required and must be a number"),
    (0, express_validator_1.body)("facilities")
        .notEmpty()
        .isArray()
        .withMessage("facilities are required"),
], upload.array("imageFiles"), uploadImagesToCloudinary_1.default, hotelController_1.addHotel);
router.get("/getMyHotels", authMiddleware_1.verifyToken, hotelController_1.getMyHotels);
router.get("/getHotelById/:id", authMiddleware_1.verifyToken, hotelController_1.getHotelById);
router.put("/updateHotelById", authMiddleware_1.verifyToken, upload.array("imageFiles"), uploadImagesToCloudinary_1.default, hotelController_1.updateHotelById);
router.get("/searchHotel", hotelController_1.searchHotel);
router.get("/getHotelDetails/:id", [(0, express_validator_1.param)("id").notEmpty().withMessage("Hotel Id is required")], hotelController_1.getHotelDetails);
router.post("/bookings/createPaymentIntent/:hotelId", authMiddleware_1.verifyToken, hotelController_1.createPaymentIntent);
router.post("/bookings/createBooking/:hotelId", authMiddleware_1.verifyToken, hotelController_1.createBooking);
exports.default = router;
