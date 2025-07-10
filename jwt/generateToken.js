
import jwt from "jsonwebtoken";
import User from '../models/user.js'; 
import dotenv from "dotenv";
dotenv.config();

const createToken = (userId, email, role) => {
    if (!process.env.JWT_TOKEN) {
        throw new Error("JWT secret key is missing in .env");
    }
    
    return jwt.sign(
        { userId: userId, email: email, role: role }, // Ensure role is included
        process.env.JWT_TOKEN,
        { expiresIn: "40d" }
    );
};
export default createToken;