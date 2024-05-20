import { Request, Response, NextFunction } from "express";
import { v2 as cloudinary } from "cloudinary";

declare global {
  namespace Express {
    interface Request {
      uploadedImageUrls?: string[];
    }
  }
}

const uploadImages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });
  try {
    const uploadedImageUrls: string[] = [];
    console.log(req.files);
    req.uploadedImageUrls = uploadedImageUrls;
    next();
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to upload images to Cloudinary" });
  }
};

export default uploadImages;
