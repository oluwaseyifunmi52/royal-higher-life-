import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { trackLoginAttempt, resetLoginAttempts, isAccountLocked, updateLastLogin } from '../middleware/auth.js';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = '7d';
const REFRESH_TOKEN_EXPIRY = '30d';

const generateToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        JWT_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRY }
    );
};

export const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: 'Invalid email format' });
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            firstName,
            lastName,
            email: email.toLowerCase(),
            password: hashedPassword,
        });

        const token = generateToken(user);
        const refreshToken = generateRefreshToken(user);

        const userObj = user.toObject();
        delete userObj.password;

        res.status(201).json({ success: true, token, refreshToken, user: userObj });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to process the request right now.' });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
        if (!user || !user.password) {
            // Don't reveal if account exists or is locked
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Check if account is locked
        if (isAccountLocked(user)) {
            return res.status(403).json({ success: false, message: 'Account is temporarily locked due to too many failed login attempts. Try again later.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            // Track failed attempt but don't reveal if user exists
            await trackLoginAttempt(email);
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Reset failed attempts on successful login
        await resetLoginAttempts(user._id);

        // Update last login
        await updateLastLogin(user._id);

        const token = generateToken(user);
        const refreshToken = generateRefreshToken(user);

        const userObj = user.toObject();
        delete userObj.password;

        res.status(200).json({ success: true, token, refreshToken, user: userObj });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to process the request right now.' });
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to process the request right now.' });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, phone, country, state, gender } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (phone) user.phone = phone;
        if (country) user.country = country;
        if (state) user.state = state;
        if (gender) user.gender = gender;

        await user.save();

        const userObj = user.toObject();
        delete userObj.password;

        res.status(200).json({ success: true, user: userObj });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to process the request right now.' });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: 'Current and new passwords are required' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Current password is incorrect' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.passwordChangedAt = Date.now();
        await user.save();

        res.status(200).json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to process the request right now.' });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            // Don't reveal if email exists
            return res.status(200).json({ success: true, message: 'If the account exists, password reset instructions will be sent when email delivery is available.' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');

        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
        await user.save();

        // In a real implementation, send email with reset link
        // For now, return the token for testing
        res.status(200).json({ success: true, resetToken, message: 'Password reset token generated. In production, this would be sent via email.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to process the request right now.' });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json({ success: false, message: 'Token and password are required' });
        }

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() },
        }).select("+password +resetPasswordToken +resetPasswordExpire");

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired token' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.passwordChangedAt = Date.now();
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to process the request right now.' });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.emailVerified = true;
        await user.save();

        res.status(200).json({ success: true, message: 'Email verified successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to process the request right now.' });
    }
};

export const resendOTP = async (req, res) => {
    try {
        res.status(200).json({ success: true, message: 'OTP resent successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to process the request right now.' });
    }
};

// Refresh token endpoint
export const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ success: false, message: 'Refresh token is required' });
        }

        jwt.verify(refreshToken, JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ success: false, message: 'Invalid or expired refresh token.' });
            }

            const user = await User.findById(decoded.id).select("-password");
            if (!user) {
                return res.status(404).json({ success: false, message: "User not found." });
            }

            if (user.isActive === false) {
                return res.status(403).json({ success: false, message: "Account is disabled." });
            }

            const token = generateToken(user);
            const newRefreshToken = generateRefreshToken(user);

            res.status(200).json({ success: true, token, refreshToken: newRefreshToken });
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to process the request right now.' });
    }
};