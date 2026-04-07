const express = require('express');
const { generateRoundRobinSlots, generateKnockoutSlots } = require('../utils/slotGenerator');

const router = express.Router();

router.post('/generate', (req, res) => {
  const { type, teams, seededTeams } = req.body;

  if (!type || !['round-robin', 'knockout'].includes(type)) {
    return res.status(400).json({ message: 'Invalid or missing type' });
  }

  if (!Array.isArray(teams) || teams.length < 2) {
    return res.status(400).json({ message: 'At least two teams are required' });
  }

  const participants = teams.map((team) => {
    if (team && typeof team === 'object' && team._id) {
      return team;
    }
    return { _id: team };
  });

  let result;
  if (type === 'round-robin') {
    result = generateRoundRobinSlots(participants);
  } else {
    const seeded = Array.isArray(seededTeams)
      ? seededTeams.map((team) => (team && typeof team === 'object' && team._id ? team : { _id: team }))
      : [];
    result = generateKnockoutSlots(participants, seeded);
  }

  res.json({ matches: result.matches, totalRounds: result.totalRounds });
});

module.exports = router;
