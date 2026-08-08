const express = require("express");
const cors = require("cors");

const authRoutes = require("./modules/auth/auth.route");
const categoryRoutes = require("./modules/category/category.route");
const taskRoutes = require("./modules/task/task.route");


const app = express();


// Middleware
app.use(cors());
app.use(express.json());


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/tasks", taskRoutes);

// Test API
app.get("/", (req,res)=>{
    res.send("Gig Market Backend is Running");
});


module.exports = app;