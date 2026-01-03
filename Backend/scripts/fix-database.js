// Run this script to fix the database indexes and clean up data
// Usage: node scripts/fix-database.js

const mongoose = require("mongoose")
const Registration = require("../models/Registration")

const fixDatabase = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URL || "mongodb+srv://VikasP:Iamvikas%40277@cluster0.zig110n.mongodb.net/SportifyCampus")
    console.log("Connected to MongoDB")

    // Drop the old index if it exists
    try {
      await Registration.collection.dropIndex("user_1_tournament_1")
      console.log("Dropped old user_1_tournament_1 index")
    } catch (error) {
      console.log("Old index not found or already dropped")
    }

    // Remove any registrations with null user/captain fields
    const deletedCount = await Registration.deleteMany({
      $or: [{ captain: null }, { captain: { $exists: false } }],
    })
    console.log(`Deleted ${deletedCount.deletedCount} invalid registrations`)

    // Create the new index
    await Registration.collection.createIndex({ captain: 1, tournament: 1 }, { unique: true })
    console.log("Created new captain_1_tournament_1 index")

    // Verify the indexes
    const indexes = await Registration.collection.indexes()
    console.log(
      "Current indexes:",
      indexes.map((idx) => idx.name),
    )

    console.log("Database fix completed successfully!")
    process.exit(0)
  } catch (error) {
    console.error("Error fixing database:", error)
    process.exit(1)
  }
}

fixDatabase()
