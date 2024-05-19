import express from "express";
import { getUser, login, logout, register, validateToken } from "../controllers/authController";
import {check} from "express-validator"
import { verifyToken } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/register",[
    check("firstName","firstName is Required").isString(),
    check("lastName","lastName is Required").isString(),
    check("email","email is Required").isEmail(),
    check("password","password with minimun 6 or more characters").isLength({
        min: 6,
    })

], register);

router.post("/signIn",[
    check("email","email is Required").isEmail(),
    check("password","password with minimun 6 or more characters").isLength({
        min: 6,
    })

], login);

router.post("/signOut",[
    check("email","email is Required").isEmail(),
    check("password","password with minimun 6 or more characters").isLength({
        min: 6,
    })

], logout);

router.get("/validateToken",verifyToken,validateToken);
router.get("/getUser",verifyToken,getUser);

export default router;
