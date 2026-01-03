const cron = require('node-cron');
const Tournament = require('../models/Tournament');
const Team = require('../models/Team');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { sendTournamentReminderEmail } = require('../utils/emailService');

/**
 * Send notifications to team captains for tournaments starting in specified days
 * @param {number} daysBefore - Number of days before tournament start
 */
const sendTournamentNotifications = async (daysBefore) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Calculate target date (daysBefore days from today)
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + daysBefore);
    targetDate.setHours(0, 0, 0, 0);
    
    // Find tournaments starting on the target date
    const nextDay = new Date(targetDate);
    nextDay.setDate(targetDate.getDate() + 1);
    
    const tournaments = await Tournament.find({
      startDate: {
        $gte: targetDate,
        $lt: nextDay
      },
      status: { $in: ['upcoming', 'registration-open', 'registration-closed'] }
    });

    console.log(`Found ${tournaments.length} tournament(s) starting in ${daysBefore} day(s)`);

    for (const tournament of tournaments) {
      // Only send notifications for team-based tournaments
      if (tournament.type !== 'team') {
        continue;
      }

      // Find all teams registered for this tournament and populate captain info
      const teams = await Team.find({ tournament: tournament._id })
        .populate('captain', 'name email');

      console.log(`Found ${teams.length} team(s) for tournament: ${tournament.name}`);

      const notificationType = daysBefore === 1 
        ? 'tournament-reminder-1day' 
        : 'tournament-reminder-10days';

      const title = daysBefore === 1
        ? `Tournament Starting Tomorrow!`
        : `Tournament Starting in ${daysBefore} Days`;

      const message = daysBefore === 1
        ? `Your tournament "${tournament.name}" (${tournament.sport}) is starting tomorrow on ${new Date(tournament.startDate).toLocaleDateString()}. Venue: ${tournament.venue}. Good luck!`
        : `Your tournament "${tournament.name}" (${tournament.sport}) is starting in ${daysBefore} days on ${new Date(tournament.startDate).toLocaleDateString()}. Venue: ${tournament.venue}. Start preparing!`;

      // Create notifications and send emails for each team captain
      const notificationsToCreate = [];
      
      for (const team of teams) {
        // Check if notification already exists to avoid duplicates
        const existingNotification = await Notification.findOne({
          user: team.captain._id || team.captain,
          tournament: tournament._id,
          team: team._id,
          type: notificationType
        });

        if (!existingNotification) {
          const captainId = team.captain._id || team.captain;
          const captainName = team.captain.name || 'Team Captain';
          const captainEmail = team.captain.email;

          notificationsToCreate.push({
            user: captainId,
            tournament: tournament._id,
            team: team._id,
            type: notificationType,
            title,
            message
          });

          // Send email notification
          if (captainEmail) {
            try {
              await sendTournamentReminderEmail({
                to: captainEmail,
                captainName: captainName,
                tournamentName: tournament.name,
                sport: tournament.sport,
                startDate: tournament.startDate,
                venue: tournament.venue,
                daysBefore: daysBefore
              });
            } catch (emailError) {
              console.error(`Failed to send email to ${captainEmail}:`, emailError);
              // Continue with other notifications even if email fails
            }
          } else {
            console.warn(`No email found for captain ${captainName} (ID: ${captainId})`);
          }
        }
      }

      if (notificationsToCreate.length > 0) {
        await Notification.insertMany(notificationsToCreate);
        console.log(`Created ${notificationsToCreate.length} notification(s) for tournament: ${tournament.name}`);
      }
    }
  } catch (error) {
    console.error(`Error sending ${daysBefore}-day notifications:`, error);
  }
};

/**
 * Initialize the notification scheduler
 * Runs daily at 9:00 AM to check for tournaments
 */
const initializeNotificationScheduler = () => {
  // Run daily at 9:00 AM
  cron.schedule('0 9 * * *', async () => {
    console.log('Running notification scheduler...');
    
    // Send notifications for tournaments starting in 10 days
    await sendTournamentNotifications(10);
    
    // Send notifications for tournaments starting in 1 day
    await sendTournamentNotifications(1);
    
    console.log('Notification scheduler completed.');
  }, {
    scheduled: true,
    timezone: "Asia/Kolkata" // Adjust timezone as needed
  });

  console.log('Notification scheduler initialized. Will run daily at 9:00 AM.');
};

module.exports = {
  sendTournamentNotifications,
  initializeNotificationScheduler
};

