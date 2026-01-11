/**
 * Complete Database Seeding Script
 * 
 * This script populates the database with comprehensive test data including:
 * - Admin and student users with Indian names
 * - Engineering departments (BE Computer Engineering, etc.)
 * - Multiple tournaments (team and individual)
 * - Teams with members
 * - Registrations
 * - Notifications (for testing notification system)
 * 
 * Usage: node scripts/seed-complete.js
 * 
 * Make sure to set MONGODB_URI in your .env file or it will use the default connection string
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Tournament = require('../models/Tournament');
const Team = require('../models/Team');
const Registration = require('../models/Registration');
const Notification = require('../models/Notification');
const Slot = require('../models/Slot');
const PreviousWinner = require('../models/PreviousWinner');

// Indian names for students
const indianNames = [
  'Arjun Sharma', 'Priya Patel', 'Rahul Kumar', 'Ananya Singh', 'Vikram Reddy',
  'Kavya Nair', 'Aditya Joshi', 'Sneha Iyer', 'Rohan Desai', 'Meera Menon',
  'Karan Malhotra', 'Divya Rao', 'Siddharth Agarwal', 'Pooja Krishnan', 'Aman Gupta',
  'Shreya Venkatesh', 'Rishabh Shah', 'Neha Chaturvedi', 'Varun Mehta', 'Anjali Pillai',
  'Harsh Trivedi', 'Isha Nambiar', 'Yash Bansal', 'Tanvi Gopal', 'Nikhil Suresh',
  'Riya Menon', 'Abhishek Nair', 'Sakshi Reddy', 'Kunal Iyer', 'Aishwarya Rao',
  'Mohit Sharma', 'Deepika Patel', 'Surya Kumar', 'Lakshmi Singh', 'Gaurav Reddy'
];

// Engineering departments
const departments = [
  'BE Computer Engineering',
  'BE Mechanical Engineering',
  'BE Electrical Engineering',
  'BE Electronics and Communication Engineering',
  'BE Civil Engineering',
  'BE Information Technology',
  'BE Chemical Engineering',
  'BE Aerospace Engineering'
];

// Sports list
const sports = ['Cricket', 'Football', 'Basketball', 'Volleyball', 'Badminton', 'Table Tennis', 'Chess', 'Athletics'];

// Generate random Indian phone number
const generatePhone = () => {
  const prefixes = ['98765', '98766', '98767', '98768', '98769', '98770', '98771', '98772'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = Math.floor(10000 + Math.random() * 90000);
  return prefix + suffix.toString().substring(0, 5);
};

// Generate roll number
const generateRollNumber = (dept, index) => {
  const deptCode = dept.split(' ')[1].substring(0, 2).toUpperCase(); // CE, ME, EE, etc.
  const year = new Date().getFullYear().toString().substring(2);
  const num = (index + 1).toString().padStart(3, '0');
  return `${deptCode}${year}${num}`;
};

// Get department code for email
const getDeptCode = (dept) => {
  const codes = {
    'BE Computer Engineering': 'cse',
    'BE Mechanical Engineering': 'me',
    'BE Electrical Engineering': 'ee',
    'BE Electronics and Communication Engineering': 'ece',
    'BE Civil Engineering': 'ce',
    'BE Information Technology': 'it',
    'BE Chemical Engineering': 'che',
    'BE Aerospace Engineering': 'ae'
  };
  return codes[dept] || 'eng';
};

const seedComplete = async () => {
  try {
    console.log('🚀 Starting database seeding...\n');

    // Connect to database
    const mongoUri = process.env.MONGODB_URI;
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Tournament.deleteMany({});
    await Team.deleteMany({});
    await Registration.deleteMany({});
    await Notification.deleteMany({});
    await Slot.deleteMany({});
    await PreviousWinner.deleteMany({});
    console.log('✅ Existing data cleared\n');

    // Create Admin User
    console.log('👤 Creating admin user...');
    const adminUser = new User({
      name: 'Dr. Rajesh Kumar',
      email: 'admin@sportifycampus.edu',
      password: 'admin123',
      rollNumber: 'ADMIN001',
      department: 'Administration',
      year: 4,
      phone: '9876500000',
      role: 'admin',
    });
    await adminUser.save();
    console.log('✅ Admin user created');
    console.log('   Email: admin@sportifycampus.edu');
    console.log('   Password: admin123\n');

    // Create Student Users
    console.log('👥 Creating student users...');
    const students = [];
    const usedNames = new Set();
    
    for (let i = 0; i < 30; i++) {
      let name;
      do {
        name = indianNames[Math.floor(Math.random() * indianNames.length)];
      } while (usedNames.has(name) && usedNames.size < indianNames.length);
      usedNames.add(name);
      
      const dept = departments[i % departments.length];
      const rollNumber = generateRollNumber(dept, i);
      const year = (i % 4) + 1; // Distribute across years 1-4
      const deptCode = getDeptCode(dept);
      const email = `${name.toLowerCase().replace(/\s+/g, '.')}@sportifycampus.edu`;
      
      students.push({
        name,
        email,
        password: 'student123',
        rollNumber,
        department: dept,
        year,
        phone: generatePhone(),
      });
    }

    const createdStudents = await User.insertMany(students);
    console.log(`✅ Created ${createdStudents.length} student users\n`);

    // Calculate dates for tournaments
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);

    const tenDaysLater = new Date(now);
    tenDaysLater.setDate(now.getDate() + 10);
    tenDaysLater.setHours(9, 0, 0, 0);

    const oneMonthLater = new Date(now);
    oneMonthLater.setMonth(now.getMonth() + 1);
    oneMonthLater.setHours(9, 0, 0, 0);

    const twoMonthsLater = new Date(now);
    twoMonthsLater.setMonth(now.getMonth() + 2);
    twoMonthsLater.setHours(9, 0, 0, 0);

    const regStart = new Date(now);
    regStart.setDate(now.getDate() - 7);
    regStart.setHours(0, 0, 0, 0);

    const regEnd = new Date(now);
    regEnd.setDate(now.getDate() + 1);
    regEnd.setHours(23, 59, 59, 0);

    // Create Tournaments
    console.log('🏆 Creating tournaments...');
    const tournaments = [
      // Tournament starting tomorrow (for 1-day notification testing)
      {
        name: 'Inter-Department Cricket Championship 2024',
        sport: 'Cricket',
        type: 'team',
        format: 'knockout',
        description: 'Annual inter-department cricket tournament. All engineering departments are invited to participate.',
        rules: [
          'Each team must have exactly 11 players',
          'Maximum 2 substitute players allowed',
          'All players must be current students',
          'Standard cricket rules apply',
          'Matches will be played in T20 format'
        ],
        startDate: tomorrow,
        endDate: new Date(tomorrow.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days later
        registrationStartDate: regStart,
        registrationEndDate: regEnd,
        maxParticipants: 16,
        maxTeamSize: 11,
        venue: 'Main Cricket Ground',
        prizes: [
          { position: 'Winner', prize: 'Trophy + Rs. 25,000' },
          { position: 'Runner-up', prize: 'Trophy + Rs. 15,000' },
          { position: 'Best Player', prize: 'Medal + Rs. 5,000' }
        ],
        status: 'registration-open',
        organizer: adminUser._id,
      },
      // Tournament starting in 10 days (for 10-day notification testing)
      {
        name: 'College Football League 2024',
        sport: 'Football',
        type: 'team',
        format: 'round-robin',
        description: 'Inter-department football tournament with round-robin format followed by knockout.',
        rules: [
          'Each team must have 11 players',
          'Maximum 3 substitutes allowed',
          'Matches duration: 90 minutes',
          'Standard FIFA rules apply'
        ],
        startDate: tenDaysLater,
        endDate: new Date(tenDaysLater.getTime() + 7 * 24 * 60 * 60 * 1000),
        registrationStartDate: regStart,
        registrationEndDate: new Date(tenDaysLater.getTime() - 1 * 24 * 60 * 60 * 1000),
        maxParticipants: 12,
        maxTeamSize: 11,
        venue: 'Football Stadium',
        prizes: [
          { position: 'Winner', prize: 'Trophy + Rs. 30,000' },
          { position: 'Runner-up', prize: 'Trophy + Rs. 20,000' }
        ],
        status: 'registration-open',
        organizer: adminUser._id,
      },
      // Individual tournament
      {
        name: 'Inter-College Chess Championship 2024',
        sport: 'Chess',
        type: 'individual',
        format: 'knockout',
        description: 'Individual chess tournament open to all students. Test your strategic thinking!',
        rules: [
          'Standard chess rules apply',
          'Time control: 15 minutes per player',
          'Swiss system for initial rounds',
          'Knockout format for final rounds'
        ],
        startDate: oneMonthLater,
        endDate: new Date(oneMonthLater.getTime() + 2 * 24 * 60 * 60 * 1000),
        registrationStartDate: regStart,
        registrationEndDate: new Date(oneMonthLater.getTime() - 3 * 24 * 60 * 60 * 1000),
        maxParticipants: 32,
        maxTeamSize: 1,
        venue: 'College Auditorium',
        prizes: [
          { position: 'Winner', prize: 'Trophy + Rs. 10,000' },
          { position: 'Runner-up', prize: 'Trophy + Rs. 5,000' },
          { position: 'Third Place', prize: 'Medal + Rs. 3,000' }
        ],
        status: 'registration-open',
        organizer: adminUser._id,
      },
      // Another team tournament
      {
        name: 'Basketball Championship 2024',
        sport: 'Basketball',
        type: 'team',
        format: 'knockout',
        description: 'Fast-paced basketball tournament for all departments.',
        rules: [
          'Each team must have 5 players',
          'Maximum 2 substitutes',
          'Standard basketball rules',
          'Matches: 4 quarters of 10 minutes each'
        ],
        startDate: twoMonthsLater,
        endDate: new Date(twoMonthsLater.getTime() + 4 * 24 * 60 * 60 * 1000),
        registrationStartDate: regStart,
        registrationEndDate: new Date(twoMonthsLater.getTime() - 7 * 24 * 60 * 60 * 1000),
        maxParticipants: 16,
        maxTeamSize: 5,
        venue: 'Basketball Court',
        prizes: [
          { position: 'Winner', prize: 'Trophy + Rs. 20,000' },
          { position: 'Runner-up', prize: 'Trophy + Rs. 12,000' }
        ],
        status: 'upcoming',
        organizer: adminUser._id,
      },
      // Completed tournament (for testing previous winners)
      {
        name: 'Volleyball Championship 2023',
        sport: 'Volleyball',
        type: 'team',
        format: 'knockout',
        description: 'Annual volleyball tournament (completed).',
        rules: [
          'Each team must have 6 players',
          'Standard volleyball rules',
          'Best of 3 sets'
        ],
        startDate: new Date('2023-10-15'),
        endDate: new Date('2023-10-20'),
        registrationStartDate: new Date('2023-09-01'),
        registrationEndDate: new Date('2023-09-30'),
        maxParticipants: 12,
        maxTeamSize: 6,
        venue: 'Volleyball Court',
        prizes: [
          { position: 'Winner', prize: 'Trophy + Rs. 15,000' }
        ],
        status: 'completed',
        organizer: adminUser._id,
        year: 2023,
      }
    ];

    const createdTournaments = await Tournament.insertMany(tournaments);
    console.log(`✅ Created ${createdTournaments.length} tournaments\n`);

    // Create Teams and Registrations
    console.log('👥 Creating teams and registrations...');
    const cricketTournament = createdTournaments.find(t => t.sport === 'Cricket');
    const footballTournament = createdTournaments.find(t => t.sport === 'Football');
    const basketballTournament = createdTournaments.find(t => t.sport === 'Basketball');
    const volleyballTournament = createdTournaments.find(t => t.sport === 'Volleyball');

    const teams = [];
    const registrations = [];

    // Create Cricket Teams (11 players each)
    for (let i = 0; i < 3; i++) {
      const captain = createdStudents[i * 3];
      const teamMembers = [];
      
      // Add captain
      teamMembers.push({
        name: captain.name,
        rollNumber: captain.rollNumber,
        department: captain.department,
        year: captain.year,
        phone: captain.phone,
        position: 'Captain',
        isCaptain: true,
      });

      // Add 10 more members
      for (let j = 1; j <= 10; j++) {
        const memberIndex = i * 3 + j;
        if (memberIndex < createdStudents.length) {
          const member = createdStudents[memberIndex];
          teamMembers.push({
            name: member.name,
            rollNumber: member.rollNumber,
            department: member.department,
            year: member.year,
            phone: member.phone,
            position: j <= 5 ? 'Batsman' : j <= 8 ? 'Bowler' : 'All-rounder',
            isCaptain: false,
          });
        }
      }

      const team = new Team({
        name: `${captain.department} Cricket Team`,
        captain: captain._id,
        members: teamMembers,
        sport: 'Cricket',
        tournament: cricketTournament._id,
        maxMembers: 11,
        isComplete: teamMembers.length === 11,
      });
      await team.save();
      teams.push(team);

      // Create registration
      const registration = new Registration({
        captain: captain._id,
        tournament: cricketTournament._id,
        team: team._id,
        status: i === 0 ? 'approved' : i === 1 ? 'pending' : 'approved',
      });
      await registration.save();
      registrations.push(registration);

      // Update tournament teams
      cricketTournament.teams.push(team._id);
    }

    // Create Football Teams (11 players each)
    for (let i = 0; i < 2; i++) {
      const captain = createdStudents[9 + i * 3];
      const teamMembers = [];
      
      teamMembers.push({
        name: captain.name,
        rollNumber: captain.rollNumber,
        department: captain.department,
        year: captain.year,
        phone: captain.phone,
        position: 'Captain',
        isCaptain: true,
      });

      for (let j = 1; j <= 10; j++) {
        const memberIndex = 9 + i * 3 + j;
        if (memberIndex < createdStudents.length) {
          const member = createdStudents[memberIndex];
          teamMembers.push({
            name: member.name,
            rollNumber: member.rollNumber,
            department: member.department,
            year: member.year,
            phone: member.phone,
            position: j <= 4 ? 'Forward' : j <= 7 ? 'Midfielder' : 'Defender',
            isCaptain: false,
          });
        }
      }

      const team = new Team({
        name: `${captain.department} Football Team`,
        captain: captain._id,
        members: teamMembers,
        sport: 'Football',
        tournament: footballTournament._id,
        maxMembers: 11,
        isComplete: teamMembers.length === 11,
      });
      await team.save();
      teams.push(team);

      const registration = new Registration({
        captain: captain._id,
        tournament: footballTournament._id,
        team: team._id,
        status: 'approved',
      });
      await registration.save();
      registrations.push(registration);

      footballTournament.teams.push(team._id);
    }

    // Create Basketball Teams (5 players each)
    for (let i = 0; i < 2; i++) {
      const captain = createdStudents[15 + i * 2];
      const teamMembers = [];
      
      teamMembers.push({
        name: captain.name,
        rollNumber: captain.rollNumber,
        department: captain.department,
        year: captain.year,
        phone: captain.phone,
        position: 'Captain',
        isCaptain: true,
      });

      for (let j = 1; j <= 4; j++) {
        const memberIndex = 15 + i * 2 + j;
        if (memberIndex < createdStudents.length) {
          const member = createdStudents[memberIndex];
          teamMembers.push({
            name: member.name,
            rollNumber: member.rollNumber,
            department: member.department,
            year: member.year,
            phone: member.phone,
            position: 'Player',
            isCaptain: false,
          });
        }
      }

      const team = new Team({
        name: `${captain.department} Basketball Team`,
        captain: captain._id,
        members: teamMembers,
        sport: 'Basketball',
        tournament: basketballTournament._id,
        maxMembers: 5,
        isComplete: teamMembers.length === 5,
      });
      await team.save();
      teams.push(team);

      const registration = new Registration({
        captain: captain._id,
        tournament: basketballTournament._id,
        team: team._id,
        status: 'pending',
      });
      await registration.save();
      registrations.push(registration);

      basketballTournament.teams.push(team._id);
    }

    // Save tournament updates
    await cricketTournament.save();
    await footballTournament.save();
    await basketballTournament.save();

    console.log(`✅ Created ${teams.length} teams`);
    console.log(`✅ Created ${registrations.length} registrations\n`);

    // Create Individual Registrations for Chess
    // Note: Registration model requires team field, so we'll just add participants to tournament
    console.log('♟️  Adding individual participants for Chess...');
    const chessTournament = createdTournaments.find(t => t.sport === 'Chess');
    const chessParticipants = [];

    for (let i = 20; i < 25; i++) {
      const participant = createdStudents[i];
      chessTournament.participants.push(participant._id);
      chessParticipants.push(participant);
    }
    await chessTournament.save();
    console.log(`✅ Added ${chessParticipants.length} individual participants for Chess tournament\n`);

    // Create Notifications for testing
    console.log('🔔 Creating notifications...');
    const notifications = [];

    // Create notifications for cricket tournament (starting tomorrow)
    for (const team of teams.filter(t => t.sport === 'Cricket')) {
      const notification = new Notification({
        user: team.captain,
        tournament: cricketTournament._id,
        team: team._id,
        type: 'tournament-reminder-1day',
        title: 'Tournament Starting Tomorrow!',
        message: `Your tournament "${cricketTournament.name}" (${cricketTournament.sport}) is starting tomorrow on ${tomorrow.toLocaleDateString()}. Venue: ${cricketTournament.venue}. Good luck!`,
        isRead: false,
      });
      await notification.save();
      notifications.push(notification);
    }

    // Create notifications for football tournament (starting in 10 days)
    for (const team of teams.filter(t => t.sport === 'Football')) {
      const notification = new Notification({
        user: team.captain,
        tournament: footballTournament._id,
        team: team._id,
        type: 'tournament-reminder-10days',
        title: 'Tournament Starting in 10 Days',
        message: `Your tournament "${footballTournament.name}" (${footballTournament.sport}) is starting in 10 days on ${tenDaysLater.toLocaleDateString()}. Venue: ${footballTournament.venue}. Start preparing!`,
        isRead: false,
      });
      await notification.save();
      notifications.push(notification);
    }

    console.log(`✅ Created ${notifications.length} notifications\n`);

    // Set winner for completed tournament
    if (teams.length > 0 && volleyballTournament) {
      volleyballTournament.winner = teams[0]._id;
      volleyballTournament.runnerUp = teams.length > 1 ? teams[1]._id : null;
      await volleyballTournament.save();
    }

    // Print Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 SEED DATA SUMMARY');
    console.log('='.repeat(60));
    console.log(`\n✅ Admin User:`);
    console.log(`   Email: admin@sportifycampus.edu`);
    console.log(`   Password: admin123`);
    console.log(`\n✅ Student Users: ${createdStudents.length}`);
    console.log(`   All passwords: student123`);
    console.log(`   Sample emails:`);
    createdStudents.slice(0, 5).forEach(student => {
      console.log(`   - ${student.email} (${student.department})`);
    });
    console.log(`\n✅ Tournaments: ${createdTournaments.length}`);
    createdTournaments.forEach(tournament => {
      console.log(`   - ${tournament.name} (${tournament.sport})`);
      console.log(`     Status: ${tournament.status}`);
      console.log(`     Start Date: ${tournament.startDate.toLocaleDateString()}`);
    });
    console.log(`\n✅ Teams: ${teams.length}`);
    console.log(`   - Cricket: ${teams.filter(t => t.sport === 'Cricket').length}`);
    console.log(`   - Football: ${teams.filter(t => t.sport === 'Football').length}`);
    console.log(`   - Basketball: ${teams.filter(t => t.sport === 'Basketball').length}`);
    console.log(`\n✅ Registrations: ${registrations.length}`);
    console.log(`   - Team registrations: ${registrations.length}`);
    console.log(`   - Individual participants (Chess): ${chessParticipants.length}`);
    console.log(`\n✅ Notifications: ${notifications.length}`);
    console.log(`   - 1-day reminders: ${notifications.filter(n => n.type === 'tournament-reminder-1day').length}`);
    console.log(`   - 10-day reminders: ${notifications.filter(n => n.type === 'tournament-reminder-10days').length}`);
    console.log('\n' + '='.repeat(60));
    console.log('🎉 Database seeding completed successfully!');
    console.log('='.repeat(60));
    console.log('\n💡 Next Steps:');
    console.log('   1. Start your server: npm start');
    console.log('   2. Login as admin: admin@sportifycampus.edu / admin123');
    console.log('   3. Login as student: Use any student email / student123');
    console.log('   4. Test all endpoints using the TESTING_DOCUMENTATION.md');
    console.log('   5. Check notifications for team captains');
    console.log('   6. The notification scheduler will run daily at 9:00 AM\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding data:', error);
    console.error(error.stack);
    process.exit(1);
  }
};

// Run the seed function
seedComplete();

