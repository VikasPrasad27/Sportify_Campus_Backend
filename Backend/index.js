const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")

// Import routes
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/user")
const teamRoutes = require("./routes/team")
const tournamentRoutes = require("./routes/tournament")
const registrationRoutes = require("./routes/registration")
const slotRoutes = require("./routes/slot")
const adminRoutes = require("./routes/admin")
const previousWinnersRoutes = require("./routes/previous-winners") // Added route import

dotenv.config()

const app = express()

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://VikasP:Iamvikas%40277@cluster0.zig110n.mongodb.net/SportifyCampus', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/teams", teamRoutes)
app.use("/api/tournaments", tournamentRoutes)
app.use("/api/registrations", registrationRoutes)
app.use("/api/slots", slotRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/previous-winners", previousWinnersRoutes) // Registered new route

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: "Something went wrong!" })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
