const generateRoundRobinSlots = (participants) => {
  const matches = [];
  const totalParticipants = participants.length;
  let matchNumber = 1;

  // Generate all possible matches (each participant plays every other participant once)
  for (let i = 0; i < totalParticipants; i++) {
    for (let j = i + 1; j < totalParticipants; j++) {
      matches.push({
        participant1: participants[i]._id,
        participant2: participants[j]._id,
        round: 1, // In round-robin, all matches are in round 1
        matchNumber: matchNumber++,
        status: 'scheduled'
      });
    }
  }

  return {
    matches,
    totalRounds: 1
  };
};

const generateKnockoutSlots = (participants) => {
  const matches = [];
  let currentParticipants = [...participants];
  let round = 1;
  let matchNumber = 1;

  // Shuffle participants for random seeding
  currentParticipants = shuffleArray(currentParticipants);

  // Add byes if odd number of participants
  if (currentParticipants.length % 2 !== 0) {
    currentParticipants.push(null); // null represents a bye
  }

  const totalRounds = Math.ceil(Math.log2(participants.length));

  // Generate first round matches
  for (let i = 0; i < currentParticipants.length; i += 2) {
    const participant1 = currentParticipants[i];
    const participant2 = currentParticipants[i + 1];

    if (participant1 && participant2) {
      matches.push({
        participant1: participant1._id,
        participant2: participant2._id,
        round,
        matchNumber: matchNumber++,
        status: 'scheduled'
      });
    } else if (participant1) {
      // Participant gets a bye (automatically advances)
      matches.push({
        participant1: participant1._id,
        participant2: null,
        winner: participant1._id,
        round,
        matchNumber: matchNumber++,
        status: 'completed'
      });
    }
  }

  // Generate placeholder matches for subsequent rounds
  let participantsInRound = Math.ceil(currentParticipants.length / 2);
  
  for (let r = 2; r <= totalRounds; r++) {
    const matchesInRound = Math.floor(participantsInRound / 2);
    
    for (let m = 0; m < matchesInRound; m++) {
      matches.push({
        participant1: null, // To be filled when previous round completes
        participant2: null,
        round: r,
        matchNumber: matchNumber++,
        status: 'scheduled'
      });
    }
    
    participantsInRound = matchesInRound;
  }

  return {
    matches,
    totalRounds
  };
};

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const advanceWinnerInKnockout = (slot, completedMatch) => {
  const { round, winner } = completedMatch;
  
  if (round < slot.totalRounds) {
    // Find the next round match where this winner should advance
    const nextRoundMatches = slot.matches.filter(m => m.round === round + 1);
    
    // Logic to determine which match in the next round this winner advances to
    // This is a simplified version - in practice, you'd need more sophisticated bracket logic
    const nextMatch = nextRoundMatches.find(m => !m.participant1 || !m.participant2);
    
    if (nextMatch) {
      if (!nextMatch.participant1) {
        nextMatch.participant1 = winner;
      } else if (!nextMatch.participant2) {
        nextMatch.participant2 = winner;
      }
    }
  }
};

module.exports = {
  generateRoundRobinSlots,
  generateKnockoutSlots,
  advanceWinnerInKnockout
};
