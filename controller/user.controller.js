import User from '../models/user.js'; 
import mongoose from 'mongoose'; // Add this line to import mongoose
import bcrypt from 'bcryptjs'
import createToken from '../jwt/generateToken.js';
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer';




import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);





export const login = async (req, res) => {
    
    try {
        const { email, passwordd } = req.body;
        if (!email || !passwordd) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        console.log("Login attempt for email:", email);

        const user = await User.findOne({ email });
        console.log("user detail = ",user);
        if (!user) {
            console.error("User not found for email:", email);
            return res.status(400).json({ message: "Invalid username or password" });
        }

        const isMatch = await bcrypt.compare(passwordd, user.passwordd);
        if (!isMatch) {
            console.error("Password mismatch for user:", email);
            return res.status(400).json({ message: "Invalid username or password" });
        }

        const token= createToken(user._id,user.email, user.role);
        if(!token)
        {
            return res.status(500).json({message:"Error in the token generating"})
        }

      
        return res.status(200).json({
            message: "User login successful",
            token,
            user: {
                _id: user._id,
                email: user.email,
                fullname: user.fullname,
                mobile: user.mobile,
                role: user.role, 
            },
            
            
        });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const signup = async (req, res) => {
    try {
        console.log('Received Data:', req.body);

        const { email, fullname, mobile, passwordd , role } = req.body;

        console.log("email:", email);
        console.log("fullname:", fullname);
        console.log("mobile:", mobile);
        console.log("passwordd:", passwordd);

        if (!email?.trim() || !fullname?.trim() || !mobile?.trim() || !passwordd?.trim()) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        const userRole = role && role.length > 0 ? role : ["user"];

        const hashedPassword = await bcrypt.hash(passwordd, 10);
        const newUser = new User({
            email,
            fullname,
            mobile,
            passwordd: hashedPassword,
            role:userRole
        });

        await newUser.save();
        createToken(newUser._id,newUser.email,newUser.role, res);

        return res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (err) {
        console.error('Signup Error:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};


export const logout=async(req,res)=>{
    try{
        return res.status(200).json({ message: "User logged out successfully" });
    }
    catch(error)
    {
        console.error('logout Error:', error.message);
        return res.status(500).json({ message: 'Internal server error occurred or something went wrong' });
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { passwordd } = req.body;

        if (!passwordd) {
            return res.status(400).json({ message: 'Please provide the password first' });
        }

        let decoded;
        try {
            // Verify the token
            decoded = jwt.verify(token, process.env.JWT_TOKEN);
        } catch (err) {
            console.error('Invalid or expired token:', err.message);
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        const user = await User.findOne({ email: decoded.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newHashPassword = await bcrypt.hash(passwordd, 10);

        console.log("Old Password:", user.passwordd);
        console.log("New Hashed Password:", newHashPassword);

        user.passwordd = newHashPassword;
        await user.save();

        console.log("Password updated successfully for user:", user.email);

        return res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Reset Password Error:', error.message);
        return res.status(500).json({ message: 'Internal server error occurred or something went wrong' });
    }
};


export const forget_pass=async(req,res)=>{
    try{
        const {email}=req.body;
        if(!email)
        {
            return res.status(400).json({message:"please provide email"})
        }
        const checkUser=await User.findOne({email});

        if(!checkUser)
        {
            return res.status(400).json({message:"User doesnot exist"})
        }

        const token=jwt.sign({email},process.env.JWT_TOKEN,{
            expiresIn:"30d",
        });

        const transporter=nodemailer.createTransport({
            service:"gmail",
            secure:true,
            auth:{
                user:process.env.MY_GMAIL,
                pass:process.env.MY_PASSWORD
            }
        })

      

        const receiver = {
            from: "vivekpvns678@gmail.com",
            to: email,
            subject: "Password Reset Request",
            html: `
                <p>Click the link below to reset your password:</p>
                <a href="${process.env.CLIENT_URL}/forget.html?token=${token}" target="_blank">
                    Reset Your Password
                </a>
                <p>If you did not request this, please ignore this email.</p>
            `
        };
        
        

        await transporter.sendMail(receiver);
        return res.status(200).send({message:"password reset link successfully sent on your gmail"})
    }
    catch(error)
    {
        return res.status(404).json({message:'password reset link not successfully sent'});
    }
}


export const GetUserData = async (req, res) => {
    try {
        // Ensure user is authenticated and has an ID
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized: No user ID found" });
        }

        console.log("Logged-in user ID:", req.user._id);

        const userData = await User.findById(req.user._id).select("-password"); // Exclude password field for security

        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log("User found:", userData);
        res.status(200).json({ user: userData }); // Keep a consistent response structure
    } catch (error) {
        console.error("Error fetching user data:", error);
        return res.status(500).json({ message: "Error fetching user data" });
    }
};
