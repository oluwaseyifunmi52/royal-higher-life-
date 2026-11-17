// First Super Admin Bootstrap Script
// Run once to create the initial super administrator
// Usage: node server/bootstrap.js
// Set environment variables FIRST_SUPER_ADMIN_NAME, FIRST_SUPER_ADMIN_EMAIL, FIRST_SUPER_ADMIN_PASSWORD

import mongoose from "mongoose";
import User from "./models/User.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

// Check if bootstrap has already been run
const BOOTSTRAP_KEY = "FIRST_SUPER_ADMIN_BOOTSTRAP_RUN";

checkAndBootstrap();

async function checkAndBootstrap() {
    // Check if bootstrap was already run
    if (process.env[BOOTSTRAP_KEY]) {
        console.log("Bootstrap already completed. Exiting.");
        process.exit(0);
    }

    // Check if any super admin already exists
    const existingSuperAdmins = await User.countDocuments({ role: "super_admin" });

    if (existingSuperAdmins > 0) {
        console.log(`Already ${existingSuperAdmins} super administrator(s) exist. Bootstrap not needed.`);
        process.exit(0);
    }

    // Get bootstrap details from environment variables
    const name = process.env.FIRST_SUPER_ADMIN_NAME;
    const email = process.env.FIRST_SUPER_ADMIN_EMAIL;
    const password = process.env.FIRST_SUPER_ADMIN_PASSWORD;

    if (!name || !email || !password) {
        console.error("ERROR: Missing bootstrap environment variables.");
        console.error("Required: FIRST_SUPER_ADMIN_NAME, FIRST_SUPER_ADMIN_EMAIL, FIRST_SUPER_ADMIN_PASSWORD");
        console.error("Set these in your .env file and run again.");
        process.exit(1);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        console.error("ERROR: Invalid email format.");
        process.exit(1);
    }

    // Validate password length
    if (password.length < 8) {
        console.error("ERROR: Password must be at least 8 characters.");
        process.exit(1);
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the first super administrator
    try {
        const user = await User.create({
            firstName: name.split(' ')[0] || "Super",
            lastName: name.split(' ').slice(1).join(' ') || "Admin",
            email: email.toLowerCase(),
            password: hashedPassword,
            role: "super_admin",
            isActive: true,
        });

        console.log("✅ First super administrator created successfully!");
        console.log(`   Email: ${user.email}`);
        console.log(`   Name: ${user.firstName} ${user.lastName}`);
        console.log(`   Role: ${user.role}`);

        // Mark bootstrap as completed
        process.env[BOOTSTRAP_KEY] = "true";
        console.log("\n⚠️  Bootstrap marked as completed.");
        console.log("   Do not run this script again.");
        console.log("   To create additional administrators, use the admin management API.");

        process.exit(0);
    } catch (error) {
        console.error("❌ Failed to create super administrator:", error.message);
        process.exit(1);
    }
}