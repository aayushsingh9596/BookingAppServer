import express, { Request, Response } from "express";
import cors from "cors";
import connectDb from "./db/db";
import authRoutes from "./routes/authRoutes";
import hotelRoutes from "./routes/hotelRoutes";
import cookieParser from "cookie-parser";

const app = express();

connectDb();

app.use(cors({
  origin: "https://bookingappserver-635a.onrender.com",
  credentials:true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/test", (req: Request, res: Response) => {
  res.status(200).json({ message: "everything is fine" });
});

app.use('/api/auth',authRoutes);
app.use('/api/hotel',hotelRoutes);

app.listen(
  // process.env.PORT,
  3000, 
  () => {
  console.log("listening on port", 3000);
});
