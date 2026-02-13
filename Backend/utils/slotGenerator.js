const mongoose = require('mongoose'); 

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const generateRoundRobinSlots = (participants) => {
  const matches = [];
  const totalParticipants = participants.length;
  
  // LOGIC CHANGE: Dynamic Grouping
  // If teams > 5, we break them into groups to avoid match explosion.
  // 16 teams -> 4 groups of 4.
  // 10 teams -> 2 groups of 5.
  let numGroups = 1;
  if (totalParticipants > 12) numGroups = 4;
  else if (totalParticipants > 5) numGroups = 2;

  // Initialize groups
  const groups = Array.from({ length: numGroups }, () => []);
  const groupNames = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // Group A, Group B...
  
  // 1. Shuffle and Distribute teams into groups
  const shuffledParticipants = shuffleArray([...participants]);
  shuffledParticipants.forEach((participant, index) => {
    const groupIndex = index % numGroups;
    groups[groupIndex].push(participant);
  });

  let matchNumber = 1;

  // 2. Generate matches for EACH group
  groups.forEach((groupParticipants, groupIndex) => {
    const groupName = groupNames[groupIndex];
    const groupSize = groupParticipants.length;

    // Standard Round Robin: Every team plays every other team in the group
    for (let i = 0; i < groupSize; i++) {
      for (let j = i + 1; j < groupSize; j++) {
        matches.push({
          participant1: groupParticipants[i]._id,
          participant2: groupParticipants[j]._id,
          round: 1, // All group stages are effectively "Round 1"
          matchNumber: matchNumber++,
          group: numGroups > 1 ? groupName : undefined, // Only tag group if we actually split them
          status: 'scheduled'
        });
      }
    }
  });

  return {
    matches,
    totalRounds: 1,
    groupsCount: numGroups
  };
};

const generateKnockoutSlots = (participants, seededTeams = []) => {
  const matches = [];
  let currentParticipants = [...participants];
  let round = 1;
  let matchNumber = 1;

  // Shuffle participants for random seeding
  currentParticipants = shuffleArray(currentParticipants);

  // If seededTeams are provided, we want to ensure they get Byes if possible.
  // A Bye is achieved when a participant is paired with 'null'.
  // So we need to position seeded teams such that they are paired with nulls.
  
  // 1. Identify seeded objects
  const seededIds = new Set(seededTeams.map(id => id.toString()));
  const seededPart = [];
  const normalPart = [];
  
  currentParticipants.forEach(p => {
    if (seededIds.has(p._id.toString())) {
      seededPart.push(p);
    } else {
      normalPart.push(p);
    }
  });

  // 2. Calculate required slots (Power of 2)
  const powerOfTwo = Math.pow(2, Math.ceil(Math.log2(participants.length)));
  const totalSlots = powerOfTwo;
  const byeCount = totalSlots - participants.length;

  // 3. Reconstruct currentParticipants array
  // Strategy: Fill pairs. 
  // If we have Byes available, give them to Seeded teams first.
  // Pair structure: [P1, P2] -> if P2 is null, P1 gets Bye.
  
  const newParticipantsList = [];
  let byesGiven = 0;
  
  // 3a. Give Byes to Seeded Teams
  while (seededPart.length > 0 && byesGiven < byeCount) {
    const p = seededPart.pop();
    newParticipantsList.push(p);
    newParticipantsList.push(null); // The Bye
    byesGiven++;
  }
  
  // 3b. Give remaining Byes to Normal Teams (if any byes left)
  while (normalPart.length > 0 && byesGiven < byeCount) {
    const p = normalPart.pop();
    newParticipantsList.push(p);
    newParticipantsList.push(null); // The Bye
    byesGiven++;
  }
  
  // 3c. Pair remaining teams (Seeded or Normal) against each other
  const remainingTeams = [...seededPart, ...normalPart];
  // Shuffle remaining to randomize matchups
  const shuffledRemaining = shuffleArray(remainingTeams);
  
  for (let i = 0; i < shuffledRemaining.length; i += 2) {
    newParticipantsList.push(shuffledRemaining[i]);
    // Ensures we don't go out of bounds if odd number (shouldn't happen if logic is correct for powerOfTwo calc, 
    // but here we are just filling slots. Wait, we need to fill exactly to powerOfTwo size? 
    // Actually, we calculated byes. The number of non-bye slots is (participants - byes).
    // The loop above consumed 'byesGiven' participants.
    // Remaining participants should be even number because (Total - Byes) must be even? 
    // No. Total Slots = Power of 2 (always even).
    // Slots filled with (P + null) = 2 slots * byesGiven.
    // Remaining slots = Total - 2*byes. Even.
    // Remaining participants = Total Participants - byesGiven.
    // We need to verify if Remaining Participants == Remaining Slots / 2 * 2?
    // Wait. 
    // Total Slots = 8. Participants = 5. Byes = 3.
    // 3 pairs of (P, null). 6 slots used. 3 participants used.
    // Remaining slots = 2. Remaining participants = 2.
    // 1 pair of (P, P).
    // So yes, just pair them up.
    if (i + 1 < shuffledRemaining.length) {
        newParticipantsList.push(shuffledRemaining[i+1]);
    } else {
        // This case implies we have an empty slot which shouldn't happen if math is right
        // But for safety, if we have odd remaining, pushing null effectively gives a bye, 
        // but we supposedly exhausted byes.
        // Actually, logic: Total Participants + Byes = PowerOfTwo.
        // We added 'byesGiven' nulls.
        // We added 'byesGiven' participants.
        // Remaining P = TotalP - byesGiven.
        // Remaining Nulls needed = Byes - byesGiven = 0 (since we exhausted loop).
        // So Remaining P must pair up.
    }
  }

  currentParticipants = newParticipantsList;

  const totalRounds = Math.log2(powerOfTwo);

  // Generate First Round Matches (Round of 16, etc.)
  for (let i = 0; i < currentParticipants.length; i += 2) {
    const participant1 = currentParticipants[i];
    const participant2 = currentParticipants[i + 1];

    if (participant1 && participant2) {
      // Standard Match
      matches.push({
        participant1: participant1._id,
        participant2: participant2._id,
        round,
        matchNumber: matchNumber++,
        status: 'scheduled'
      });
    } else if (participant1) {
      // Participant 1 gets a Bye (Participant 2 is null)
      matches.push({
        participant1: participant1._id,
        participant2: null,
        round,
        matchNumber: matchNumber++,
        status: 'completed', // Bye matches are auto-completed
        winner: participant1._id
      });
    }
  }

  // The current code only seems to generate Round 1. 
  // We will keep it as is for Round 1 generation.

  // Generate placeholder matches for subsequent rounds (Quarters, Semis, Finals)
  // We reduce matches by half every round
  let matchesInCurrentRound = currentParticipants.length / 2;
  
  for (let r = 2; r <= totalRounds; r++) {
    matchesInCurrentRound = matchesInCurrentRound / 2;
    
    for (let m = 0; m < matchesInCurrentRound; m++) {
      matches.push({
        participant1: null, // To be filled by winners
        participant2: null,
        round: r,
        matchNumber: matchNumber++,
        status: 'scheduled'
      });
    }
  }

  return {
    matches,
    totalRounds
  };
};

const advanceWinnerInKnockout = (slot, completedMatch) => {
  const { round, matchNumber, winner } = completedMatch;

  // 1. Safety Check: If it's the final round, nowhere to advance
  if (round >= slot.totalRounds) {
    return;
  }

  // 2. LOGIC CHANGE: Calculate the Exact Next Match ID
  // In a bracket, Match 1 and Match 2 always feed into the first match of the next round.
  // Formula to find the "parent" match in the next round:
  // We need to find the match in (round + 1) where the matchNumber corresponds to this pair.
  
  // Count how many matches were in the current round to offset logic? 
  // Easier approach: Use the array index or strict Math logic if matchNumbers are sequential.
  // Since matchNumbers are sequential (1-8, 9-12, 13-14, 15), we can assume:
  
  // Total matches in current round = total_matches / 2^(round-1) ? No, simpler to search.
  
  // Let's use the 'Feed' logic:
  // Every pair of matches (Odd, Even) -> Feeds one match in next round.
  // Next Match Number usually isn't easily calculated purely by +1 without knowing the offset.
  // HOWEVER, we can find the specific match object.
  
  // We need to find which "index" this match was in its specific round.
  const matchesInThisRound = slot.matches.filter(m => m.round === round)
                                         .sort((a,b) => a.matchNumber - b.matchNumber);
  
  const indexInRound = matchesInThisRound.findIndex(m => m.matchNumber === matchNumber);
  
  if (indexInRound === -1) return; // Error finding match
  
  // The index in the NEXT round is floor(current_index / 2)
  const indexInNextRound = Math.floor(indexInRound / 2);
  
  const matchesInNextRound = slot.matches.filter(m => m.round === round + 1)
                                         .sort((a,b) => a.matchNumber - b.matchNumber);
                                         
  const nextMatch = matchesInNextRound[indexInNextRound];

  if (nextMatch) {
    // 3. Determine Slot (Top or Bottom)
    // If indexInRound is Even (0, 2, 4...), it's the Top slot (Participant 1)
    // If indexInRound is Odd (1, 3, 5...), it's the Bottom slot (Participant 2)
    // Note: This assumes 0-based index.
    
    if (indexInRound % 2 === 0) {
      nextMatch.participant1 = winner;
    } else {
      nextMatch.participant2 = winner;
    }
    
    // Optional: If both slots are now filled, you might want to trigger something?
    // For now, we just save the data.
  }
};

module.exports = {
  generateRoundRobinSlots,
  generateKnockoutSlots,
  advanceWinnerInKnockout
};

// const generateRoundRobinSlots = (participants) => {
//   const matches = [];
//   const totalParticipants = participants.length;
//   let matchNumber = 1;

//   // Generate all possible matches (each participant plays every other participant once)
//   for (let i = 0; i < totalParticipants; i++) {
//     for (let j = i + 1; j < totalParticipants; j++) {
//       matches.push({
//         participant1: participants[i]._id,
//         participant2: participants[j]._id,
//         round: 1, // In round-robin, all matches are in round 1
//         matchNumber: matchNumber++,
//         status: 'scheduled'
//       });
//     }
//   }

//   return {
//     matches,
//     totalRounds: 1
//   };
// };

// const generateKnockoutSlots = (participants) => {
//   const matches = [];
//   let currentParticipants = [...participants];
//   let round = 1;
//   let matchNumber = 1;

//   // Shuffle participants for random seeding
//   currentParticipants = shuffleArray(currentParticipants);

//   // Add byes if odd number of participants
//   if (currentParticipants.length % 2 !== 0) {
//     currentParticipants.push(null); // null represents a bye
//   }

//   const totalRounds = Math.ceil(Math.log2(participants.length));

//   // Generate first round matches
//   for (let i = 0; i < currentParticipants.length; i += 2) {
//     const participant1 = currentParticipants[i];
//     const participant2 = currentParticipants[i + 1];

//     if (participant1 && participant2) {
//       matches.push({
//         participant1: participant1._id,
//         participant2: participant2._id,
//         round,
//         matchNumber: matchNumber++,
//         status: 'scheduled'
//       });
//     } else if (participant1) {
//       // Participant gets a bye (automatically advances)
//       matches.push({
//         participant1: participant1._id,
//         participant2: null,
//         winner: participant1._id,
//         round,
//         matchNumber: matchNumber++,
//         status: 'completed'
//       });
//     }
//   }

//   // Generate placeholder matches for subsequent rounds
//   let participantsInRound = Math.ceil(currentParticipants.length / 2);
  
//   for (let r = 2; r <= totalRounds; r++) {
//     const matchesInRound = Math.floor(participantsInRound / 2);
    
//     for (let m = 0; m < matchesInRound; m++) {
//       matches.push({
//         participant1: null, // To be filled when previous round completes
//         participant2: null,
//         round: r,
//         matchNumber: matchNumber++,
//         status: 'scheduled'
//       });
//     }
    
//     participantsInRound = matchesInRound;
//   }

//   return {
//     matches,
//     totalRounds
//   };
// };

// const shuffleArray = (array) => {
//   const shuffled = [...array];
//   for (let i = shuffled.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
//   }
//   return shuffled;
// };

// const advanceWinnerInKnockout = (slot, completedMatch) => {
//   const { round, winner } = completedMatch;
  
//   if (round < slot.totalRounds) {
//     // Find the next round match where this winner should advance
//     const nextRoundMatches = slot.matches.filter(m => m.round === round + 1);
    
//     // Logic to determine which match in the next round this winner advances to
//     // This is a simplified version - in practice, you'd need more sophisticated bracket logic
//     const nextMatch = nextRoundMatches.find(m => !m.participant1 || !m.participant2);
    
//     if (nextMatch) {
//       if (!nextMatch.participant1) {
//         nextMatch.participant1 = winner;
//       } else if (!nextMatch.participant2) {
//         nextMatch.participant2 = winner;
//       }
//     }
//   }
// };

// module.exports = {
//   generateRoundRobinSlots,
//   generateKnockoutSlots,
//   advanceWinnerInKnockout
// };
