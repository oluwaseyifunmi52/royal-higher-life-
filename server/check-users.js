import mongoose from "mongoose";
import User from "./models/User.js";

mongoose.connect("mongodb://127.0.0.1:27017/royal-higher-life")
    .then(() => User.find({}))
    .then(users => {
        console.log("All users:");
        users.forEach(u => console.log("-", u.email, "role:", u.role));
        mongoose.connection.close();
    })
    .catch(err => {
        console.error("Error:", err);
        mongoose.connection.close();
    });