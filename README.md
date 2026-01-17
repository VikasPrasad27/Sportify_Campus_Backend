# 🏆 Sportify Campus

<div align="center">

**A Smart Sports Event Management System for Colleges**

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.5-brightgreen.svg)](https://www.mongodb.com/)

*Streamline your college sports tournaments with automated management, notifications, and comprehensive tracking*

[Features](#-key-features) • [Quick Start](#-quick-start-guide) • [API Documentation](#-api-endpoints) • [Demo Credentials](#-demo-credentials)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Quick Start Guide](#-quick-start-guide)
- [API Endpoints](#-api-endpoints)
- [Demo Credentials](#-demo-credentials)
- [Features Breakdown](#-features-breakdown)
- [Environment Setup](#-environment-setup)
- [Database Seeding](#-database-seeding)
- [Testing](#-testing)
- [Contributing](#-contributing)

---

## 🎯 Overview

**Sportify Campus** is a comprehensive web application designed to manage sports tournaments and events in educational institutions. It automates the entire tournament lifecycle from registration to winner declaration, making sports event management effortless for administrators and participants.

### What Problem Does It Solve?

- ❌ **Manual tournament management** is time-consuming and error-prone
- ❌ **Team coordination** becomes chaotic without proper tools
- ❌ **Participants miss important updates** about tournaments
- ❌ **Match scheduling** requires complex manual calculations
- ❌ **Winner tracking** across multiple tournaments is difficult

### How Sportify Campus Helps

- ✅ **Automated tournament management** with status tracking
- ✅ **Streamlined team registration** and member management
- ✅ **Smart notification system** (email + in-app) for important updates
- ✅ **Automatic match slot generation** for tournaments
- ✅ **Comprehensive winner history** with photos and details

---

## ✨ Key Features

### 🎮 Tournament Management
- Create and manage tournaments (team & individual sports)
- Support for multiple tournament formats (Round-Robin, Knockout)
- Tournament status tracking (Upcoming → Registration Open → Ongoing → Completed)
- Prize management and winner declaration
- Tournament history and previous winners gallery

### 👥 Team & Registration System
- **Team Registration**: Captains can register teams with multiple members
- **Individual Registration**: Support for individual sports (Chess, Athletics, etc.)
- **Member Management**: Add/remove team members before registration closes
- **Registration Approval**: Admin can approve/reject registrations
- **Registration Statistics**: Track participation rates and trends

### 🔔 Smart Notification System
- **Automated Reminders**: Notifications sent 10 days and 1 day before tournaments
- **Dual Channel**: Both email and in-app notifications
- **Read/Unread Tracking**: Mark notifications as read, track unread count
- **Scheduled Jobs**: Daily automated checks using cron jobs

### 📅 Match Scheduling
- **Automatic Slot Generation**: Generate match fixtures automatically
- **Tournament Format Support**: Works with Round-Robin and Knockout formats
- **Match Result Updates**: Admin can update match results
- **User-Specific Slots**: Participants can view their upcoming matches

### 👨‍💼 Admin Dashboard
- **Dashboard Statistics**: Overview of tournaments, users, registrations
- **User Management**: View and manage user accounts
- **Tournament Control**: Create, update, and manage tournaments
- **Winner Management**: Declare winners and upload photos

### 🏅 Previous Winners
- **Winner Gallery**: View past tournament winners with photos
- **Year-wise Filtering**: Filter winners by academic year
- **Photo Management**: Upload and manage winner photos

---

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer + Cloudinary
- **Email Service**: Nodemailer
- **Scheduling**: node-cron
- **Validation**: express-validator

### Frontend
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Icons**: Lucide React

### Development Tools
- **Package Manager**: npm
- **Dev Server**: Nodemon
- **Environment**: dotenv

### Cloud Storage & Testing
- **Cloudinaray** : Sdk
- **Postman** : Api Endpoints Testing

---

## 📁 Project Structure

```
Sportify Campus/
│
├── Backend/                    # Backend API Server
│   ├── app/                    # Next.js app directory
│   ├── components/             # React components
│   ├── controllers/           # Route controllers
│   │   ├── authController.js
│   │   ├── tournamentController.js
│   │   ├── teamController.js
│   │   ├── registrationController.js
│   │   ├── notificationController.js
│   │   └── ...
│   ├── models/                 # MongoDB schemas
│   │   ├── User.js
│   │   ├── Tournament.js
│   │   ├── Team.js
│   │   ├── Registration.js
│   │   └── ...
│   ├── routes/                 # API routes
│   │   ├── auth.js
│   │   ├── tournament.js
│   │   ├── team.js
│   │   └── ...
│   ├── middlewares/           # Custom middlewares
│   │   ├── auth.js
│   │   ├── validation.js
│   │   └── upload.js
│   ├── utils/                 # Utility functions
│   │   ├── emailService.js
│   │   ├── cloudinary.js
│   │   └── slotGenerator.js
│   ├── jobs/                  # Scheduled jobs
│   │   └── notificationScheduler.js
│   ├── scripts/               # Database scripts
│   │   ├── seed-complete.js
│   │   └── seed-data.js
│   ├── index.js               # Server entry point
│   └── package.json
│
├── Frontend/                   # Frontend application (React.js)
│
└── README.md                   # This file
```

---

## 🚀 Quick Start Guide

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd "Sportify Campus"
```

### Step 2: Install Dependencies

```bash
cd Backend
npm install
```

### Step 3: Environment Setup

Create a `.env` file in the `Backend` directory:

```env
# Database
MONGODB_URI=your-mongodb-connection-string

# Server
PORT=5000

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key

# Email Configuration (Optional - for notifications)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_SERVICE=gmail

# Cloudinary (Optional - for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Step 4: Seed the Database (Optional)

Populate the database with sample data:

```bash
npm run seed
```

This creates:
- 1 admin user
- 30 student users
- 5 sample tournaments
- Teams and registrations
- Sample notifications

### Step 5: Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

### Step 6: Test the API

Use Postman, Thunder Client, or any API client to test endpoints. See [API Endpoints](#-api-endpoints) section below.

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/register` | Register new user | ❌ |
| `POST` | `/api/auth/login` | Login user | ❌ |
| `GET` | `/api/auth/profile` | Get current user profile | ✅ |

### Tournaments
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/tournaments` | Get all tournaments | ❌ |
| `GET` | `/api/tournaments/upcoming` | Get upcoming tournaments | ❌ |
| `GET` | `/api/tournaments/:id` | Get tournament by ID | ❌ |
| `GET` | `/api/tournaments/winners` | Get previous winners | ❌ |
| `POST` | `/api/tournaments` | Create tournament | 🔒 Admin |
| `PUT` | `/api/tournaments/:id` | Update tournament | ✅ |

### Teams
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/teams/register-team` | Register team | ✅ |
| `POST` | `/api/teams/register-individual` | Register individually | ✅ |
| `GET` | `/api/teams/tournament/:tournamentId` | Get teams by tournament | ❌ |
| `GET` | `/api/teams/captain` | Get captain's teams | ✅ |
| `PUT` | `/api/teams/:teamId` | Update team | ✅ |
| `DELETE` | `/api/teams/:teamId` | Delete team | ✅ |

### Registrations
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/registrations/captain` | Get captain's registrations | ✅ |
| `GET` | `/api/registrations/tournament/:tournamentId` | Get tournament registrations | 🔒 Admin |
| `GET` | `/api/registrations/tournament/:tournamentId/stats` | Get registration stats | 🔒 Admin |
| `PUT` | `/api/registrations/:registrationId/status` | Update registration status | 🔒 Admin |

### Slots & Matches
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/slots/generate/:tournamentId` | Generate match slots | ✅ |
| `GET` | `/api/slots/tournament/:tournamentId` | Get tournament slots | ❌ |
| `GET` | `/api/slots/user` | Get user's slots | ✅ |
| `PUT` | `/api/slots/:slotId/matches/:matchId` | Update match result | 🔒 Admin |

### Notifications
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/notifications` | Get all notifications | ✅ |
| `GET` | `/api/notifications/unread-count` | Get unread count | ✅ |
| `PUT` | `/api/notifications/:id/read` | Mark as read | ✅ |
| `PUT` | `/api/notifications/mark-all-read` | Mark all as read | ✅ |
| `DELETE` | `/api/notifications/:id` | Delete notification | ✅ |

### Admin
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/admin/dashboard` | Get dashboard stats | 🔒 Admin |
| `GET` | `/api/admin/users` | Get all users | 🔒 Admin |
| `PUT` | `/api/admin/users/:userId/status` | Update user status | 🔒 Admin |
| `POST` | `/api/admin/tournaments/:tournamentId/winner` | Set tournament winner | 🔒 Admin |

### Previous Winners
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/previous-winners` | Get all previous winners | ❌ |
| `POST` | `/api/previous-winners` | Create previous winner | 🔒 Admin |
| `PUT` | `/api/previous-winners/:id` | Update previous winner | 🔒 Admin |
| `DELETE` | `/api/previous-winners/:id` | Delete previous winner | 🔒 Admin |

**Legend:**
- ✅ = Authentication required
- 🔒 = Admin authentication required
- ❌ = No authentication required

---

## 🔑 Demo Credentials

After running the seed script, you can use these credentials:

### Admin Account
```
Email: admin@sportifycampus.edu
Password: admin123
```

### Student Accounts (Sample)
All student accounts use password: `student123`

```
Email: arjun.sharma@sportifycampus.edu
Email: priya.patel@sportifycampus.edu
Email: rahul.kumar@sportifycampus.edu
... (30 students total)
```

**Note:** See `Backend/scripts/README-SEED.md` for the complete list of seeded users.

---

## 🎨 Features Breakdown

### 1. Tournament Lifecycle Management

**Status Flow:**
```
Upcoming → Registration Open → Registration Closed → Ongoing → Completed
```

**Tournament Types:**
- **Team Tournaments**: Cricket, Football, Basketball, Volleyball, etc.
- **Individual Tournaments**: Chess, Athletics, Badminton Singles, etc.

**Tournament Formats:**
- **Round-Robin**: Every team plays every other team
- **Knockout**: Single elimination tournament

### 2. Smart Notification System

**How It Works:**
1. A scheduled job runs daily at 9:00 AM
2. Checks for tournaments starting in 10 days and 1 day
3. Finds all registered teams for those tournaments
4. Sends notifications to team captains via:
   - **Email**: Professional HTML emails with tournament details
   - **In-App**: Stored in database, accessible via API

**Notification Types:**
- `tournament-reminder-10days`: Sent 10 days before tournament
- `tournament-reminder-1day`: Sent 1 day before tournament

### 3. Registration Workflow

**For Team Tournaments:**
1. Captain creates a team with team name
2. Adds team members (up to max team size)
3. Submits registration
4. Admin reviews and approves/rejects
5. Approved teams can participate

**For Individual Tournaments:**
1. Student registers individually
2. Admin approves registration
3. Student can participate

### 4. Match Slot Generation

**Automatic Generation:**
- Analyzes tournament format (Round-Robin/Knockout)
- Calculates number of matches needed
- Creates match slots with dates and times
- Assigns teams/participants to matches

**Match Management:**
- Admin can update match results
- System tracks wins/losses
- Automatic progression in knockout format

### 5. Winner Management

**Winner Declaration:**
- Admin can declare winners after tournament completion
- Upload winner photos
- Set runner-up
- Store in previous winners gallery

**Previous Winners:**
- View all past winners
- Filter by year
- View photos and details

---

## ⚙️ Environment Setup

### Required Environment Variables

```env
# Database (Required)
MONGODB_URI=mongodb://localhost:27017/sportifycampus
# or
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sportifycampus

# Server (Required)
PORT=5000

# Authentication (Required)
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

### Optional Environment Variables

```env
# Email Service (Optional - for notifications)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_SERVICE=gmail

# Cloudinary (Optional - for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Gmail Setup (for Email Notifications)

1. Enable **2-Step Verification** in your Google Account
2. Generate **App Password**:
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Select "Mail" and generate password
   - Use this password in `EMAIL_PASSWORD`

---

## 🌱 Database Seeding

### Quick Seed

```bash
cd Backend
npm run seed
```

### What Gets Created

- ✅ **1 Admin User**
- ✅ **30 Student Users** (with Indian names)
- ✅ **5 Sample Tournaments** (Cricket, Football, Chess, Basketball, Volleyball)
- ✅ **7 Teams** with members
- ✅ **Registrations** with different statuses
- ✅ **Sample Notifications**

### Customization

You can customize the seed script by editing `Backend/scripts/seed-complete.js`:
- Change number of students
- Add more departments
- Modify tournament dates
- Add more sports

**⚠️ Warning:** The seed script **deletes all existing data** before seeding. Only use in development!

---

## 🧪 Testing

### Manual Testing

Use Postman or any API client to test endpoints. See `Backend/postman-testing-guide.md` for detailed testing instructions.

### Testing Flow

1. **Authentication**
   - Register admin/student
   - Login and get JWT token

2. **Tournament Management**
   - Create tournament (as admin)
   - View tournaments
   - Update tournament status

3. **Team Registration**
   - Register team (as student)
   - View registrations
   - Approve registration (as admin)

4. **Match Management**
   - Generate slots
   - Update match results
   - View user's matches

5. **Notifications**
   - Check notifications
   - Mark as read
   - Test email notifications

### API Documentation

See `Backend/TESTING_DOCUMENTATION.md` for comprehensive API documentation with examples.

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines

- Follow existing code style
- Add comments for complex logic
- Update documentation for new features
- Test your changes thoroughly

---

## 📚 Additional Documentation

- **Database Seeding**: `Backend/scripts/README-SEED.md`
- **API Testing Guide**: `Backend/postman-testing-guide.md`
- **Testing Documentation**: `Backend/TESTING_DOCUMENTATION.md`
- **Implementation Summary**: `Backend/IMPLEMENTATION_SUMMARY.md`

---

## 👨‍💻 Author

**Vikas Prasad**

---

## 🙏 Acknowledgments

- Built with ❤️ for educational institutions
- Uses modern web technologies for optimal performance
- Designed with scalability and maintainability in mind

---

<div align="center">

**Made with ❤️ for Sports Enthusiasts**

[⬆ Back to Top](#-sportify-campus)

</div>
