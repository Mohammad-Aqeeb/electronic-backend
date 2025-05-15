const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const Users = require('../model/Users');
require("dotenv").config();

const UserController = {
    // User Registration
    userRegister : async (req, res)=>{
        const { name, email, phone, password, confirmPassword, role } = req.body;

        if (!name || !email || !phone || !password || !role) {
            return res.status(400).json({
                success : false,
                message: "All fields are required" 
            });
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({
                success : false,
                message: "Passwords do not match"
            });
        }

        try {
            // Check if user already exists
            const existingUser = await Users.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    success : false,
                    message : "Email already registered"
                });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create new user
            const data =  await Users.create({name, email, phone, role, password: hashedPassword, email_verified_at: null, remember_token: null});
            res.status(201).json({
                success: true,
                data : data,
                message : "Registration Successful! Redirecting to login page..."
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({
                success : false,
                error : error.message,
                message: "Server error" 
            });
        }
    },

    // User Login
    userLogin : async (req, res)=>{
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success : false,
                message : "Email and password are required",
                error: error.message
            });
        }
    
        try {
            // Find user by email
            const user = await Users.findOne({ email });
            if (!user) {
                return res.status(400).json({
                    success : false,
                    message : "User not found",
                    error: error.message
                });
            }
    
            // Compare password with hashed password
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({
                    success : false,
                    message: "Wrong password"
                });
            }
            
            let payload = {
                email : user.email,
                id : user._id,
                role : user.role
            }

            const token = jwt.sign(payload, process.env.JWT_SECRETE, { expiresIn : "2h" });

            const options = {
                expires : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly : true
            }

            res.cookie("token", token, options).status(200).json({
                success : true,
                user : user,
                message : "Login success",  
                token
            })

        } catch (error) {
            console.log(error);
            res.status(500).json({
                success : false,
                message : "Server error",
                error : error.message
            });
        }
    },

    // Edit Profile
    editProfile : async (req, res)=>{
        const { id } = req.params;
        const { name, email, phone, password } = req.body;

        try {
            const user = await Users.findById(id);
            if (!user) {
                return res.status(404).json({
                    success : false,
                    message : "User not found"
                });
            }

            // Update user fields
            user.name = name || user.name;
            user.email = email || user.email;
            user.phone = phone || user.phone;
 
            if(password) {
                // Hash new password if provided
                user.password = await bcrypt.hash(password, 10);
            }

            const updatedUser = await Users.findByIdAndUpdate(
                {_id : id}, 
                {name : user.name,email : user.email, phone : user.phone, password : user.password},
                {new : true}
            )

            return res.status(200).json({
                success : true,
                data: updatedUser,
                message: "User info updated"
            });
    
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success : true,
                error : error.message,
                message: "Server error"
            });
        }    
    },

    // Get Profile
    getProfile : async (req, res)=>{
        // const { id } = req.params || req.id._id;
        console.log(req.user);
        const id = req.user._id;
        try {
            const user = await Users.findById(id);

            if (!user) {
                return res.status(404).json({
                    success  : false,
                    message : "Profile not found"
                });
            }
    
            return res.status(200).json({
                success: true,
                data: user,
                message :"Profile found",
            });

        } catch (error) {
            res.status(500).json({ 
                success : true,
                messageg : "Server error",
                error : error.message
        });
        }
    }
}

module.exports = UserController;