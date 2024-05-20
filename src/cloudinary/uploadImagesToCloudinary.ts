import { Request, Response, NextFunction } from "express";
import { v2 as cloudinary } from "cloudinary";
// import fs from "fs";

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

    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {

        console.log(file);
        // const result = await cloudinary.uploader.upload(file.path);
        // uploadedImageUrls.push(result.secure_url);
      }

      // if (uploadedImageUrls.length > 0) {
      //   for (const file of req.files) {
      //     fs.unlinkSync(file.path);
      //   }
      // }
      req.uploadedImageUrls = uploadedImageUrls;
      next();
    } else {
      res.status(400).json({ error: "No files were uploaded." });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to upload images to Cloudinary" });
  }
};

export default uploadImages;
