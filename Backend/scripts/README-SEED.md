# Database Seeding Script - Complete Guide

## Overview
The `seed-complete.js` script populates your database with comprehensive test data including:
- Admin and student users with **Indian names**
- **Engineering departments** (BE Computer Engineering, BE Mechanical Engineering, etc.)
- Multiple tournaments (team and individual sports)
- Teams with members
- Registrations
- Notifications (for testing the notification system)

## Prerequisites

1. **Node.js and npm** installed
2. **MongoDB** connection configured
3. **Environment variables** set up (optional - script uses default if not set)

## How to Run the Script

### Step 1: Navigate to Backend Directory
```bash
cd Backend
```

### Step 2: Install Dependencies (if not already done)
```bash
npm install
```

### Step 3: Set Environment Variables (Optional)
Create or update your `.env` file in the Backend directory:

```env
MONGODB_URI=your-mongodb-connection-string
```

**Note:** If `MONGODB_URI` is not set, the script will use the default connection string from the code.

### Step 4: Run the Seed Script
```bash
node scripts/seed-complete.js
```

Or using npm:
```bash
npm run seed
```
(You may need to add this script to package.json - see below)

## What Gets Created

### 1. Admin User
- **Email:** `admin@sportifycampus.edu`
- **Password:** `admin123`
- **Role:** Admin

### 2. Student Users (30 students)
- **All passwords:** `student123`
- **Names:** Indian names (Arjun Sharma, Priya Patel, etc.)
- **Departments:** 
  - BE Computer Engineering
  - BE Mechanical Engineering
  - BE Electrical Engineering
  - BE Electronics and Communication Engineering
  - BE Civil Engineering
  - BE Information Technology
  - BE Chemical Engineering
  - BE Aerospace Engineering
- **Years:** Distributed across 1st to 4th year
- **Email format:** `firstname.lastname@sportifycampus.edu`

### 3. Tournaments (5 tournaments)
1. **Cricket Championship** - Team tournament (starts tomorrow - for 1-day notification testing)
2. **Football League** - Team tournament (starts in 10 days - for 10-day notification testing)
3. **Chess Championship** - Individual tournament (starts in 1 month)
4. **Basketball Championship** - Team tournament (starts in 2 months)
5. **Volleyball Championship 2023** - Completed tournament (for testing previous winners)

### 4. Teams
- **3 Cricket teams** (11 players each)
- **2 Football teams** (11 players each)
- **2 Basketball teams** (5 players each)

### 5. Registrations
- Team registrations with different statuses (approved, pending)
- Individual participants for Chess tournament

### 6. Notifications
- **1-day reminders** for Cricket tournament captains
- **10-day reminders** for Football tournament captains

## Sample Login Credentials

### Admin
```
Email: admin@sportifycampus.edu
Password: admin123
```

### Students (Sample - all use password: student123)
```
Email: arjun.sharma@sportifycampus.edu
Email: priya.patel@sportifycampus.edu
Email: rahul.kumar@sportifycampus.edu
... (30 students total)
```

## Testing Features

After running the seed script, you can test:

1. **Authentication**
   - Login as admin
   - Login as students

2. **Tournament Management**
   - View all tournaments
   - View tournament details
   - Create new tournaments (as admin)

3. **Team Management**
   - View teams by tournament
   - View captain's teams
   - Update team members
   - Delete teams

4. **Registration**
   - View registrations
   - Approve/reject registrations (as admin)
   - View registration statistics

5. **Notifications**
   - View notifications for team captains
   - Mark notifications as read
   - Check unread count
   - Test email notifications (if configured)

6. **Admin Dashboard**
   - View dashboard statistics
   - Manage users
   - Set tournament winners

## Adding Seed Script to package.json

To make it easier to run, add this to your `package.json`:

```json
{
  "scripts": {
    "seed": "node scripts/seed-complete.js",
    "seed:reset": "node scripts/seed-complete.js"
  }
}
```

Then you can run:
```bash
npm run seed
```

## Important Notes

⚠️ **Warning:** This script will **DELETE ALL EXISTING DATA** in the following collections:
- Users
- Tournaments
- Teams
- Registrations
- Notifications
- Slots
- Previous Winners

**Only run this in development/testing environments!**

## Troubleshooting

### Error: Cannot connect to MongoDB
- Check your MongoDB connection string
- Ensure MongoDB is running
- Verify network connectivity

### Error: Duplicate key error
- The script clears all data first, so this shouldn't happen
- If it does, manually clear the collections and try again

### Error: Validation error
- Check that all required fields are present
- Verify date formats are correct
- Ensure department names match the list in the script

### Script runs but no data appears
- Check MongoDB connection
- Verify the database name is correct
- Check for any error messages in the console

## Customization

You can customize the seed script by:

1. **Changing number of students:** Modify the loop count (currently 30)
2. **Adding more departments:** Add to the `departments` array
3. **Changing tournament dates:** Modify the date calculations
4. **Adding more sports:** Add to the `sports` array and create tournaments
5. **Changing team sizes:** Modify `maxTeamSize` in tournament creation

## Next Steps After Seeding

1. **Start your server:**
   ```bash
   npm start
   # or
   npm run dev
   ```

2. **Test the API:**
   - Use Postman or any API client
   - Refer to `TESTING_DOCUMENTATION.md` for endpoint details
   - Login with admin or student credentials

3. **Test Notifications:**
   - Login as a team captain
   - Check notifications endpoint: `GET /api/notifications`
   - Verify email notifications (if email is configured)

4. **Test All Features:**
   - Create new tournaments
   - Register teams
   - Approve registrations
   - Generate slots
   - Update match results
   - Set winners

## Support

If you encounter any issues:
1. Check the console output for error messages
2. Verify your MongoDB connection
3. Ensure all dependencies are installed
4. Check the `TESTING_DOCUMENTATION.md` for API details

---

**Happy Testing! 🚀**

