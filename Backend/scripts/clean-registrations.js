// Run this script to clean up any invalid registrations
// Usage: node scripts/clean-registrations.js

const mongoose = require("mongoose")
const Registration = require("../models/Registration")
const Team = require("../models/Team")

const cleanRegistrations = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URL || "mongodb+srv://VikasP:Iamvikas%40277@cluster0.zig110n.mongodb.net/SportifyCampus")
    console.log("Connected to MongoDB")

    // Find all registrations with null or missing captain
    const invalidRegistrations = await Registration.find({
      $or: [{ captain: null }, { captain: { $exists: false } }],
    })

    console.log(`Found ${invalidRegistrations.length} invalid registrations`)

    // Delete invalid registrations
    const deleteResult = await Registration.deleteMany({
      $or: [{ captain: null }, { captain: { $exists: false } }],
    })

    console.log(`Deleted ${deleteResult.deletedCount} invalid registrations`)

    // Find teams without corresponding registrations
    const teams = await Team.find({}).populate("captain")
    const registrations = await Registration.find({})

    const teamsWithoutRegistrations = []

    for (const team of teams) {
      const hasRegistration = registrations.find((reg) => reg.team && reg.team.toString() === team._id.toString())

      if (!hasRegistration) {
        teamsWithoutRegistrations.push(team)
      }
    }

    console.log(`Found ${teamsWithoutRegistrations.length} teams without registrations`)

    // Create missing registrations
    for (const team of teamsWithoutRegistrations) {
      try {
        const registration = new Registration({
          captain: team.captain._id,
          tournament: team.tournament,
          team: team._id,
          status: "pending",
        })

        await registration.save()
        console.log(`Created registration for team: ${team.name}`)
      } catch (error) {
        console.log(`Could not create registration for team ${team.name}:`, error.message)
      }
    }

    console.log("Cleanup completed!")
    process.exit(0)
  } catch (error) {
    console.error("Error cleaning registrations:", error)
    process.exit(1)
  }
}

cleanRegistrations()
