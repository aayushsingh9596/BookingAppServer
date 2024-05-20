import express from "express";
import multer from "multer";
import { verifyToken } from "../middleware/authMiddleware";
import { body, param } from "express-validator";
import {
  addHotel,
  createBooking,
  createPaymentIntent,
  getHotelById,
  getHotelDetails,
  getMyHotels,
  searchHotel,
  updateHotelById,
} from "../controllers/hotelController";
import uploadImages from "../cloudinary/uploadImagesToCloudinary";
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, '../../images/hotelImages'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/addHotel",
  verifyToken,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("city").notEmpty().withMessage("city is required"),
    body("country").notEmpty().withMessage("country is required"),
    body("description").notEmpty().withMessage("description is required"),
    body("type").notEmpty().withMessage("Hotel type is required"),
    body("pricePerNight")
      .notEmpty()
      .isNumeric()
      .withMessage("pricePerNigh is required and must be a number"),
    body("facilities")
      .notEmpty()
      .isArray()
      .withMessage("facilities are required"),
  ],
  upload.array("imageFiles"),
  uploadImages,
  addHotel
);
router.get("/getMyHotels", verifyToken, getMyHotels);
router.get("/getHotelById/:id", verifyToken, getHotelById);
router.put(
  "/updateHotelById",
  verifyToken,
  upload.array("imageFiles"),
  uploadImages,
  updateHotelById
);
router.get("/searchHotel", searchHotel);
router.get(
  "/getHotelDetails/:id",
  [param("id").notEmpty().withMessage("Hotel Id is required")],
  getHotelDetails
);
router.post(
  "/bookings/createPaymentIntent/:hotelId",
  verifyToken,
  createPaymentIntent
);
router.post("/bookings/createBooking/:hotelId", verifyToken, createBooking);

export default router;
