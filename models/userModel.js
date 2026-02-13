import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// ─────────────────────────────────────────────────
//  Constants
// ─────────────────────────────────────────────────
const SALT_ROUNDS = 12;

// RFC 5322–compliant email regex (simplified but strict)
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+$/;

/**
 * Password complexity requirements:
 *  - Minimum 8 characters
 *  - At least one uppercase letter        [A-Z]
 *  - At least one lowercase letter        [a-z]
 *  - At least one digit                   [0-9]
 *  - At least one special character       [@$!%*?&#^()_+\-=]
 */
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=])[A-Za-z\d@$!%*?&#^()_+\-=]{8,}$/;

// ─────────────────────────────────────────────────
//  Schema Definition
// ─────────────────────────────────────────────────
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required."],
            trim: true,
            minlength: [2, "Name must be at least 2 characters."],
            maxlength: [50, "Name cannot exceed 50 characters."],
        },

        email: {
            type: String,
            required: [true, "Email is required."],
            unique: true,
            lowercase: true,
            trim: true,
            validate: {
                validator: (value) => EMAIL_REGEX.test(value),
                message: (props) => `"${props.value}" is not a valid email address.`,
            },
        },

        password: {
            type: String,
            required: [true, "Password is required."],
            minlength: [8, "Password must be at least 8 characters."],
            validate: {
                validator: function (value) {
                    // Only validate raw password (not the already-hashed one)
                    // The pre-save hook runs AFTER validation, so at this
                    // point the value is still the plain-text password.
                    if (this.isModified("password")) {
                        return PASSWORD_REGEX.test(value);
                    }
                    return true;
                },
                message:
                    "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.",
            },
            // 🔒 Never return password in query results by default
            select: false,
        },

        role: {
            type: String,
            enum: {
                values: ["user", "admin"],
                message: "Role must be either 'user' or 'admin'.",
            },
            default: "user",
        },

        lastLogin: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true, // adds createdAt & updatedAt automatically
    }
);

// ─────────────────────────────────────────────────
//  Pre-save Hook — Automatic Password Hashing
// ─────────────────────────────────────────────────
userSchema.pre("save", async function () {
    // Only hash if the password field was modified (or is new)
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    this.password = await bcrypt.hash(this.password, salt);
});

// ─────────────────────────────────────────────────
//  Instance Method — Secure Password Comparison
// ─────────────────────────────────────────────────
/**
 * Compares a candidate (plain-text) password against the
 * hashed password stored in this document.
 *
 * Usage:
 *   const user = await User.findOne({ email }).select("+password");
 *   const isMatch = await user.comparePassword(candidatePassword);
 *
 * @param  {String}  candidatePassword  —  plain-text password to verify
 * @return {Promise<Boolean>}            —  true if passwords match
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// ─────────────────────────────────────────────────
//  Export
// ─────────────────────────────────────────────────
const User = mongoose.model("User", userSchema);

export default User;
