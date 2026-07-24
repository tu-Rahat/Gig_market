const express = require("express");
const cors = require("cors");

const authRoutes = require("./modules/auth/auth.route");


const app = express();


// Middleware
app.use(cors());
app.use(express.json());


// Routes
app.use("/api/auth", authRoutes);


// Test API
app.get("/", (req,res)=>{
    res.send("Gig Market Backend is Running");
});


module.exports = app;