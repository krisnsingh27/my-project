require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);


app.get("/api/protected", authMiddleware, (req, res) => {
    res.json({ message: "Protected content", user: req.user });
});


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTIwNDFhNTQzOTY4OTc3Y2M3MDU1NWEiLCJpYXQiOjE3NjM3MjE2NTEsImV4cCI6MTc2MzgwODA1MX0.DsBCN-ZX-L9RTor5Ygtilm2BaAXkDIzzSHw_n5YaZ7w