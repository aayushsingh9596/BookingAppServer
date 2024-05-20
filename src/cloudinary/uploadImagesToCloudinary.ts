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
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }
    const uploadPromises = files.map((file) => {
      return new Promise<string>((resolve, reject) => {
        const base64Image = `data:${
          file.mimetype
        };base64,${file.buffer.toString("base64")}`;
        cloudinary.uploader.upload(base64Image, (error, result: any) => {
          if (error) {
            reject(error);
          } else {
            resolve(result.secure_url);
          }
        });
      });
    });

    const uploadedImages = await Promise.all(uploadPromises);
    req.uploadedImageUrls = uploadedImages;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Upload failed" });
  }
};

export default uploadImages;
