
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import dotenv from "dotenv";
dotenv.config();


const SecureRoute = async (req, res, next) => {
    try {
        let token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ message: "Not authorized, no token provided" });
        }

        if (token.startsWith("Bearer")) {
            token = token.split(" ")[1]; // Extract the actual token
            console.log("Token extracted in middleware : ", token); // Log token to check if it's correct
        } else {
            return res.status(401).json({ message: "Invalid token format" });
        }

        if (!process.env.JWT_TOKEN) {
            throw new Error("JWT secret key is missing in .env");
        }

        // Verify the token
        const verified = jwt.verify(token, process.env.JWT_TOKEN);

        if (!verified) {
            return res.status(403).json({ message: "Invalid Token" });
        }

        // Find the user based on the verified userId from the token
        const user = await User.findById(verified.userId).select("-passwordd"); // Correct field name

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error("Error in SecureRoute Middleware:", err.message);
        res.status(500).json({ message: `Internal server error: ${err.message}` });
    }
};


const restrict = (role) => {      // wrapup fxn
    return (req, res, next) => {
        if (!req.user || !req.user.role.includes(role)) {
            return res.status(403).json({ message: "User not authorized" });
        }
        next();
    };
};


export { SecureRoute , restrict};
