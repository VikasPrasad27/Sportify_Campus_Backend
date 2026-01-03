const Team = require("../models/Team")
const Tournament = require("../models/Tournament")
const User = require("../models/User")
const Registration = require("../models/Registration")

const createTeamAndRegister = async (req, res) => {
  try {
    const {
      teamName,
      tournamentId,
      members, // Array of member objects with name, rollNumber, department, year, phone
      sport,
    } = req.body
    const captainId = req.user.id

    // Check if tournament exists and is team-based
    const tournament = await Tournament.findById(tournamentId)
    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" })
    }

    if (tournament.type !== "team") {
      return res.status(400).json({ message: "This tournament is not for teams" })
    }

    // Check if registration is open
    const now = new Date()
    if (now < tournament.registrationStartDate || now > tournament.registrationEndDate) {
      return res.status(400).json({ message: "Registration is not open for this tournament" })
    }

    // Check if captain already registered for this tournament
    const existingRegistration = await Registration.findOne({
      captain: captainId,
      tournament: tournamentId,
    })

    if (existingRegistration) {
      return res.status(400).json({ message: "You have already registered for this tournament" })
    }

    // Check if captain already registered for this sport in any tournament
    const existingTeam = await Team.findOne({
      captain: captainId,
      sport: sport,
    }).populate("tournament")

    if (existingTeam && existingTeam.tournament.status !== "completed") {
      return res.status(400).json({
        message: "You are already registered for this sport in another active tournament",
      })
    }

    // Validate team size
    if (members.length > tournament.maxTeamSize) {
      return res.status(400).json({
        message: `Team size cannot exceed ${tournament.maxTeamSize} members`,
      })
    }

    // Check for duplicate roll numbers within the team
    const rollNumbers = members.map((member) => member.rollNumber)
    const uniqueRollNumbers = [...new Set(rollNumbers)]
    if (rollNumbers.length !== uniqueRollNumbers.length) {
      return res.status(400).json({ message: "Duplicate roll numbers found in team members" })
    }

    // Check if any member is already registered for this sport
    const existingTeams = await Team.find({
      sport: sport,
      "members.rollNumber": { $in: rollNumbers },
    }).populate("tournament")

    const activeTeams = existingTeams.filter((team) => team.tournament.status !== "completed")

    if (activeTeams.length > 0) {
      const conflictingMembers = []
      activeTeams.forEach((team) => {
        team.members.forEach((member) => {
          if (rollNumbers.includes(member.rollNumber)) {
            conflictingMembers.push({
              name: member.name,
              rollNumber: member.rollNumber,
              tournament: team.tournament.name,
            })
          }
        })
      })

      return res.status(400).json({
        message: "Some team members are already registered for this sport",
        conflictingMembers,
      })
    }

    // Add captain to members if not already included
    const captainInMembers = members.find((member) => member.rollNumber === req.user.rollNumber)
    if (!captainInMembers) {
      members.unshift({
        name: req.user.name,
        rollNumber: req.user.rollNumber,
        department: req.user.department,
        year: req.user.year,
        phone: req.user.phone,
        position: "Captain",
        isCaptain: true,
      })
    } else {
      captainInMembers.isCaptain = true
      captainInMembers.position = "Captain"
    }

    // Create team
    const team = new Team({
      name: teamName,
      captain: captainId,
      members: members,
      sport: sport,
      tournament: tournamentId,
      maxMembers: tournament.maxTeamSize,
      isComplete: members.length === tournament.maxTeamSize,
    })

    await team.save()

    // Create registration
    const registration = new Registration({
      captain: captainId,
      tournament: tournamentId,
      team: team._id,
    })

    await registration.save()

    // Update tournament teams array
    tournament.teams.push(team._id)
    await tournament.save()

    const populatedTeam = await Team.findById(team._id)
      .populate("captain", "name rollNumber email")
      .populate("tournament", "name sport startDate endDate")

    res.status(201).json({
      message: "Team created and registered successfully",
      team: populatedTeam,
      registration,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

const registerIndividual = async (req, res) => {
  try {
    const { tournamentId } = req.body
    const userId = req.user.id

    // Check if tournament exists and is individual
    const tournament = await Tournament.findById(tournamentId)
    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" })
    }

    if (tournament.type !== "individual") {
      return res.status(400).json({ message: "This tournament is for teams only" })
    }

    // Check if registration is open
    const now = new Date()
    if (now < tournament.registrationStartDate || now > tournament.registrationEndDate) {
      return res.status(400).json({ message: "Registration is not open for this tournament" })
    }

    // Check if user already registered for this tournament
    const existingRegistration = await Registration.findOne({
      captain: userId,
      tournament: tournamentId,
    })

    if (existingRegistration) {
      return res.status(400).json({ message: "You have already registered for this tournament" })
    }

    // Check if user already registered for this sport
    const existingIndividualReg = await Registration.findOne({
      captain: userId,
    }).populate("tournament")

    if (
      existingIndividualReg &&
      existingIndividualReg.tournament.sport === tournament.sport &&
      existingIndividualReg.tournament.status !== "completed"
    ) {
      return res.status(400).json({
        message: "You are already registered for this sport in another tournament",
      })
    }

    // Create registration
    const registration = new Registration({
      captain: userId,
      tournament: tournamentId,
    })

    await registration.save()

    // Update tournament participants
    tournament.participants.push(userId)
    await tournament.save()

    res.status(201).json({
      message: "Individual registration successful",
      registration,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

const getTeamsByTournament = async (req, res) => {
  try {
    const { tournamentId } = req.params

    const teams = await Team.find({ tournament: tournamentId })
      .populate("captain", "name rollNumber department year email phone")
      .populate("tournament", "name sport")
      .sort({ createdAt: -1 })

    res.json({ teams })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

const getCaptainTeams = async (req, res) => {
  try {
    const teams = await Team.find({ captain: req.user.id })
      .populate("tournament", "name sport startDate endDate status")
      .sort({ createdAt: -1 })

    res.json({ teams })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

const updateTeam = async (req, res) => {
  try {
    const { teamId } = req.params
    const { members } = req.body

    const team = await Team.findById(teamId)
    if (!team) {
      return res.status(404).json({ message: "Team not found" })
    }

    // Check if user is captain
    if (team.captain.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only team captain can update team" })
    }

    // Check if tournament registration is still open
    const tournament = await Tournament.findById(team.tournament)
    const now = new Date()
    if (now > tournament.registrationEndDate) {
      return res.status(400).json({ message: "Registration period has ended, cannot update team" })
    }

    // Validate team size
    if (members.length > team.maxMembers) {
      return res.status(400).json({
        message: `Team size cannot exceed ${team.maxMembers} members`,
      })
    }

    // Ensure captain is in the members list
    const captainInMembers = members.find((member) => member.rollNumber === req.user.rollNumber)
    if (!captainInMembers) {
      members.unshift({
        name: req.user.name,
        rollNumber: req.user.rollNumber,
        department: req.user.department,
        year: req.user.year,
        phone: req.user.phone,
        position: "Captain",
        isCaptain: true,
      })
    }

    team.members = members
    team.isComplete = members.length === team.maxMembers
    await team.save()

    const updatedTeam = await Team.findById(teamId)
      .populate("captain", "name rollNumber")
      .populate("tournament", "name sport")

    res.json({
      message: "Team updated successfully",
      team: updatedTeam,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

const deleteTeam = async (req, res) => {
  try {
    const { teamId } = req.params

    const team = await Team.findById(teamId)
    if (!team) {
      return res.status(404).json({ message: "Team not found" })
    }

    // Check if user is captain
    if (team.captain.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only team captain can delete team" })
    }

    // Check if tournament registration is still open
    const tournament = await Tournament.findById(team.tournament)
    const now = new Date()
    if (now > tournament.registrationEndDate) {
      return res.status(400).json({ message: "Registration period has ended, cannot delete team" })
    }

    // Remove team from tournament
    tournament.teams = tournament.teams.filter((t) => t.toString() !== teamId)
    await tournament.save()

    // Delete registration
    await Registration.findOneAndDelete({ team: teamId })

    // Delete team
    await Team.findByIdAndDelete(teamId)

    res.json({ message: "Team deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

module.exports = {
  createTeamAndRegister,
  registerIndividual,
  getTeamsByTournament,
  getCaptainTeams,
  updateTeam,
  deleteTeam,
}
