// Run this script to populate database with sample data
// Usage: node scripts/seed-data.js

const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const User = require("../models/User")
const Tournament = require("../models/Tournament")
const Team = require("../models/Team")
const Registration = require("../models/Registration")

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URL || "mongodb+srv://VikasP:Iamvikas%40277@cluster0.zig110n.mongodb.net/SportifyCampus")
    console.log("Connected to MongoDB")

    // Clear existing data
    await User.deleteMany({})
    await Tournament.deleteMany({})
    await Team.deleteMany({})
    await Registration.deleteMany({})
    console.log("Cleared existing data")

    // Create Admin User
    const adminUser = new User({
      name: "Admin User",
      email: "admin@college.edu",
      password: "admin123",
      rollNumber: "ADMIN001",
      department: "Administration",
      year: 4,
      phone: "9876543200",
      role: "admin",
    })
    await adminUser.save()
    console.log("Admin user created")

    // Create Student Users (Captains)
    const students = [
      {
        name: "John Doe",
        email: "john.doe@college.edu",
        password: "password123",
        rollNumber: "CS001",
        department: "Computer Science",
        year: 4,
        phone: "9876543210",
      },
      {
        name: "Alice Johnson",
        email: "alice.johnson@college.edu",
        password: "password123",
        rollNumber: "ME001",
        department: "Mechanical Engineering",
        year: 2,
        phone: "9876543211",
      },
      {
        name: "Bob Smith",
        email: "bob.smith@college.edu",
        password: "password123",
        rollNumber: "EE001",
        department: "Electrical Engineering",
        year: 4,
        phone: "9876543212",
      },
    ]

    const createdStudents = await User.insertMany(students)
    console.log("Student users created")

    // Create Tournaments
    const tournaments = [
      {
        name: "Inter-College Cricket Championship 2024",
        sport: "Cricket",
        type: "team",
        format: "knockout",
        description: "Annual cricket tournament for all departments",
        rules: [
          "Each team must have 11 players",
          "Maximum 2 substitute players allowed",
          "All players must be current students",
        ],
        startDate: new Date("2024-03-15T09:00:00.000Z"),
        endDate: new Date("2024-03-20T18:00:00.000Z"),
        registrationStartDate: new Date("2024-02-01T00:00:00.000Z"),
        registrationEndDate: new Date("2024-02-28T23:59:59.000Z"),
        maxParticipants: 16,
        maxTeamSize: 11,
        venue: "College Cricket Ground",
        prizes: [
          { position: "Winner", prize: "Trophy + Rs. 10,000" },
          { position: "Runner-up", prize: "Trophy + Rs. 5,000" },
        ],
        status: "registration-open",
        organizer: adminUser._id,
      },
      {
        name: "College Chess Championship 2024",
        sport: "Chess",
        type: "individual",
        format: "knockout",
        description: "Individual chess tournament for all students",
        rules: ["Standard chess rules apply", "Time control: 15 minutes per player"],
        startDate: new Date("2024-05-01T09:00:00.000Z"),
        endDate: new Date("2024-05-03T18:00:00.000Z"),
        registrationStartDate: new Date("2024-04-01T00:00:00.000Z"),
        registrationEndDate: new Date("2024-04-25T23:59:59.000Z"),
        maxParticipants: 32,
        maxTeamSize: 1,
        venue: "College Auditorium",
        prizes: [{ position: "Winner", prize: "Trophy + Rs. 3,000" }],
        status: "registration-open",
        organizer: adminUser._id,
      },
    ]

    const createdTournaments = await Tournament.insertMany(tournaments)
    console.log("Tournaments created")

    console.log("\n=== SEED DATA SUMMARY ===")
    console.log("Admin Login:")
    console.log("Email: admin@college.edu")
    console.log("Password: admin123")
    console.log("\nStudent Logins:")
    students.forEach((student) => {
      console.log(`Email: ${student.email}, Password: ${student.password}`)
    })
    console.log("\nTournament IDs:")
    createdTournaments.forEach((tournament) => {
      console.log(`${tournament.name}: ${tournament._id}`)
    })

    process.exit(0)
  } catch (error) {
    console.error("Error seeding data:", error)
    process.exit(1)
  }
}

seedData()

/*
{
        "name": "Inter-College Football Championship 2025",
        "sport": "Football",
        "type": "team",
        "format": "round-robin",
        "description": "Annual Football tournament for all departments",
        "rules": [
          "Each team must have 6 players",
          "Maximum 2 substitute players allowed",
          "All players must be current students",
        ],
        "startDate": "2025-03-15",
        "endDate": "2025-03-20",
        "registrationStartDate": "2025-02-15",
        "registrationEndDate": "2025-02-20",
        "maxParticipants": 10,
        "maxTeamSize": 6,
        "venue": "College Football Ground",
        "prizes": [
          { "position": "Winner", "prize": "Trophy + Medal" },
          { "position": "Runner-up", "prize": "Trophy + Medal" }
        ],
        "status": "registration-open",
        "organizer": "68bb1cc50fe901df66e83adb"
      }

      Add Header in Postman to cherk - content type &
      authenication - Bearer Token_ID
*/

//FOOTBALL
/*
{
    "name":"vikas",
    "email":"vikastest@gmail.com",
    "password":"Vikas@1234",
    "rollNumber":"22F116",
    "department":"Comp",
    "year":4,
    "phone":7877387829
}
    Token : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YmJlY2Y3MzIyNDJlYjczM2JjYmI2MSIsImlhdCI6MTc1NzE0NjM2MCwiZXhwIjoxNzU5NzM4MzYwfQ.PW56gkR3BFTWA2MJVSABQHlABz00PyER9URtUhoKkcw"
*/