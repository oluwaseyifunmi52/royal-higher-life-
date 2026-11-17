const mongoose = require("mongoose");
const User = require("./models/User.js");
const bcrypt = require("bcryptjs");

async function test() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/royal-higher-life");
        console.log("MongoDB connected");

        const existingSuperAdmins = await User.countDocuments({ role: "super_admin" });
        console.log("Existing super admins:", existingSuperAdmins);

        if (existingSuperAdmins > 0) {
            console.log("Super admins already exist. Bootstrap not needed.");
            mongoose.connection.close();
            return;
        }

        const name = "Super Administrator";
        const email = "admin@royal-higherlife.org";
        const password = "SecureAdminPass123!";

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            firstName: name.split(' ')[0],
            lastName: name.split(' ').slice(1).join(' '),
            email: email.toLowerCase(),
            password: hashedPassword,
            role: "super_admin",
            isActive: true,
        });

        console.log("✅ First super administrator created:");
        console.log("   Email:", user.email);
        console.log("   Name:", user.firstName + " " + user.lastName);
        console.log("   Role:", user.role);

        const countAfter = await User.countDocuments({ role: "super_admin" });
        console.log("Super admins after:", countAfter);

        await mongoose.connection.close();
        console.log("Done!");
    } catch (err) {
        console.error("Error:", err.message);
        await mongoose.connection.close();
    }
}

test();