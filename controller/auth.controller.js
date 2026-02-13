import User from "../models/userModel.js";

const authController = {
    // ─── Page Renderers ───
    loginPage: (req, res) => {
        return res.render("pages/login");
    },

    signUpPage: (req, res) => {
        return res.render("pages/sign-up");
    },

    // ─── API: Register ───
    register: async (req, res) => {
        try {
            const { name, email, password } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({ email: email?.toLowerCase() });
            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: "An account with this email already exists.",
                });
            }

            // Create user (password auto-hashed via pre-save hook)
            const user = await User.create({ name, email, password });

            return res.status(201).json({
                success: true,
                message: "Account created successfully!",
                user: { id: user._id, name: user.name, email: user.email, role: user.role },
            });
        } catch (error) {
            console.error('Registration error:', error);

            // Handle Mongoose validation errors gracefully
            if (error.name === "ValidationError") {
                const messages = Object.values(error.errors).map((e) => e.message);
                return res.status(400).json({
                    success: false,
                    message: messages.join(" "),
                });
            }

            // Handle MongoDB duplicate key error
            if (error.code === 11000) {
                return res.status(409).json({
                    success: false,
                    message: "An account with this email already exists.",
                });
            }

            return res.status(500).json({ success: false, message: error.message || "Server error. Please try again." });
        }
    },

    // ─── API: Login ───
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: "Email and password are required.",
                });
            }

            // Must explicitly select password (it's excluded by default)
            const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid email or password.",
                });
            }

            // Compare password using the schema instance method
            const isMatch = await user.comparePassword(password);

            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid email or password.",
                });
            }

            // Update last login timestamp
            user.lastLogin = new Date();
            await user.save({ validateBeforeSave: false });

            return res.json({
                success: true,
                message: "Login successful!",
                user: { id: user._id, name: user.name, email: user.email, role: user.role },
            });
        } catch (error) {
            console.error('Login error:', error);
            return res.status(500).json({ success: false, message: error.message || "Server error. Please try again." });
        }
    },
};

export default authController;
