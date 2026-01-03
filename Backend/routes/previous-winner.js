const express = require("express")
const { adminAuth } = require("../middlewares/auth")
const { upload } = require("../middlewares/upload")
const {
  createPreviousWinner,
  listPreviousWinners,
  updatePreviousWinner,
  deletePreviousWinner,
} = require("../controllers/previousWinnerController")

const router = express.Router()

// Public: list previous winners
router.get("/", listPreviousWinners)

// Admin: create previous winner with photos
router.post("/", adminAuth, upload.array("photos", 10), createPreviousWinner)

// Admin: update text and photos (can append and/or remove)
router.put("/:id", adminAuth, upload.array("photos", 10), updatePreviousWinner)

// Admin: delete previous winner (and cloud photos)
router.delete("/:id", adminAuth, deletePreviousWinner)

module.exports = router
