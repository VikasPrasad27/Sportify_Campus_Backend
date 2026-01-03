const { body, validationResult } = require("express-validator")

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array(),
    })
  }
  next()
}

const validateRegistration = [
  body("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("rollNumber").trim().isLength({ min: 1 }).withMessage("Roll number is required"),
  body("department").trim().isLength({ min: 1 }).withMessage("Department is required"),
  body("year").isInt({ min: 1, max: 4 }).withMessage("Year must be between 1 and 4"),
  body("phone").isMobilePhone().withMessage("Please provide a valid phone number"),
  handleValidationErrors,
]

const validateTournament = [
  body("name").trim().isLength({ min: 2 }).withMessage("Tournament name must be at least 2 characters"),
  body("sport").trim().isLength({ min: 1 }).withMessage("Sport is required"),
  body("type").isIn(["individual", "team"]).withMessage("Type must be individual or team"),
  body("format").isIn(["round-robin", "knockout"]).withMessage("Format must be round-robin or knockout"),
  body("startDate").isISO8601().withMessage("Valid start date is required"),
  body("endDate").isISO8601().withMessage("Valid end date is required"),
  body("maxParticipants").isInt({ min: 2 }).withMessage("Maximum participants must be at least 2"),
  handleValidationErrors,
]

const validateTeamRegistration = [
  body("teamName").trim().isLength({ min: 2 }).withMessage("Team name must be at least 2 characters"),
  body("tournamentId").isMongoId().withMessage("Valid tournament ID is required"),
  body("sport").trim().isLength({ min: 1 }).withMessage("Sport is required"),
  body("members").isArray({ min: 1 }).withMessage("At least one team member is required"),
  body("members.*.name").trim().isLength({ min: 2 }).withMessage("Member name must be at least 2 characters"),
  body("members.*.rollNumber").trim().isLength({ min: 1 }).withMessage("Member roll number is required"),
  body("members.*.department").trim().isLength({ min: 1 }).withMessage("Member department is required"),
  body("members.*.year").isInt({ min: 1, max: 4 }).withMessage("Member year must be between 1 and 4"),
  body("members.*.phone").isMobilePhone().withMessage("Member phone number must be valid"),
  handleValidationErrors,
]

const validateIndividualRegistration = [
  body("tournamentId").isMongoId().withMessage("Valid tournament ID is required"),
  handleValidationErrors,
]

module.exports = {
  handleValidationErrors,
  validateRegistration,
  validateTournament,
  validateTeamRegistration,
  validateIndividualRegistration,
}
