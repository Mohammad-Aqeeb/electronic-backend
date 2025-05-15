    // addProduct : async (req, res)=>{

    // }

const bcrypt = require('bcryptjs');
const Seller = require('../model/Seller');

const SellerController = {
    // Seller Registration
    sellerRegister: async (req, res) => {
        const { name, email, phone, password, confirmPassword } = req.body;

        if (!name || !email || !phone || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });
        }

        try {
            const existingSeller = await Seller.findOne({ email });
            if (existingSeller) {
                return res.status(400).json({
                    success: false,
                    message: "Email already registered"
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const data = await Seller.create({
                name,
                email,
                phone,
                password: hashedPassword,
                email_verified_at: null,
                remember_token: null
            });

            return res.status(201).json({
                success: true,
                data : data,
                message: "Registration successful! Redirecting to login page..."
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Server error",
                error: error.message
            });
        }
    },

    // Seller Login
    sellerLogin: async (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        try {
            const seller = await Seller.findOne({ email });
            if (!seller) {
                return res.status(400).json({
                    success: false,
                    message: "Email not Found"
                });
            }

            const isMatch = await bcrypt.compare(password, seller.password);
            if (!isMatch) {
                return res.status(400).json({
                    success: false,
                    message: "Wrong password"
                });
            }

            return res.status(200).json({
                success: true,
                data: seller,
                message: "Login successful"
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Server error",
                error: error.message
            });
        }
    },

    // Edit Profile
    editProfile: async (req, res) => {
        const { id } = req.params;
        const { name, email, phone, password } = req.body;

        try {
            const seller = await Seller.findById(id);
            if (!seller) {
                return res.status(404).json({
                    success: false,
                    message: "Seller not found"
                });
            }

            seller.name = name || seller.name;
            seller.email = email || seller.email;
            seller.phone = phone || seller.phone;

            if (password) {
                seller.password = await bcrypt.hash(password, 10);
            }

            const updatedSeller = await Seller.findByIdAndUpdate(
                {_id : id },
                { name: seller.name, email: seller.email, phone: seller.phone, password: seller.password },
                { new: true }
            );

            return res.status(200).json({
                success: true,
                data: updatedSeller,
                message: "Seller info updated"
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Server error",
                error: error.message
            });
        }
    },

    // Get Profile
    getProfile: async (req, res) => {
        const { id } = req.params;

        try {
            const seller = await Seller.findById(id);

            if (!seller){
                return res.status(404).json({
                    success: false,
                    message: "Profile not found"
                });
            }

            return res.status(200).json({
                success: true,
                data: seller,
                message: "Profile found"
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Server error",
                error: error.message
            });
        }
    }

};

module.exports = SellerController;
