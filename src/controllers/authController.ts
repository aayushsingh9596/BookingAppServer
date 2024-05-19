import User from "../models/userModel";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


const getUser = async(req: Request, res: Response) => {
  const userId = req.userId;
  try {
    const user=await User.findById(userId).select("-password");
    if(!user){
      return res.status(404).json({message:"User not found"})
    }
    res.json(user);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const register = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }

  try {
    const { email } = req.body;

    let user = await User.findOne({ email: email });
    if (user) {
      return res
        .status(400)
        .json({ message: "User with email already registered" });
    }

    user = new User(req.body);
    await user.save();

    console.log(user);

    const token = jwt.sign({ userId: user._id }, "jsonwebtokensecret", {
      expiresIn: "1d",
    });

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 86400000,
    });

    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "error while registering user" });
  }
};

const login = async (req: Request, res: Response) => {
  const erros = validationResult(req);
  if (!erros.isEmpty()) {
    res.status(400).json({ message: erros.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password as string);

    if (!isMatch) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, "jsonwebtokensecret", {
      expiresIn: "1d",
    });

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 86400000,
    });

    res.status(200).json({ message: user._id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error while logging in" });
  }
};

const logout=(req: Request, res: Response) => {
  res.cookie("auth_token", "", {
    expires: new Date(0),
  });
  res.status(200).json({message:"Signed Out Successfully"});
};

const validateToken = (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res
        .status(403)
        .json({ message: "Something went wrong,userId is not found" });
    }
    res.status(200).json({ userId });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Something went wrong while validating user" });
  }
};


export { register,login ,logout,validateToken,getUser};
