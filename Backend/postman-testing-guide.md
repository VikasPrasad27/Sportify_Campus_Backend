# SportifyCampus API Testing Guide

## Prerequisites
1. Start your backend server: `npm run dev`
2. Ensure MongoDB is running
3. Import the Postman collection from `postman-collection.json`

## Testing Flow

### 1. Authentication Setup
**Order of execution:**
1. **Register Admin** - Create admin account
2. **Register Student** - Create student account (captain)
3. **Login Admin** - Get admin token (auto-saved to `{{adminToken}}`)
4. **Login Student** - Get student token (auto-saved to `{{authToken}}`)

### 2. Tournament Management
**Admin Operations:**
1. **Create Cricket Tournament** - Creates team tournament (saves `{{tournamentId}}`)
2. **Create Football Tournament** - Creates another team tournament
3. **Create Chess Tournament** - Creates individual tournament
4. **Update Tournament** - Change tournament status to "registration-open"

### 3. Team Registration
**Student Operations:**
1. **Register Team for Cricket** - Captain registers team with 11 members
2. **Register Individual for Chess** - Individual registration
3. **Get Captain's Teams** - View registered teams
4. **Update Team Members** - Modify team roster (before registration closes)

### 4. Admin Management
**Admin Operations:**
1. **Get Tournament Registrations** - View all registrations for a tournament
2. **Approve Registration** - Approve team registration
3. **Generate Tournament Slots** - Create match fixtures
4. **Set Tournament Winner** - Declare winner and upload photos

## Sample Test Data

### Student Registration Data:
\`\`\`json
{
  "name": "John Doe",
  "email": "john.doe@college.edu",
  "password": "password123",
  "rollNumber": "CS001",
  "department": "Computer Science",
  "year": 3,
  "phone": "9876543210"
}
\`\`\`

### Team Registration Data:
\`\`\`json
{
  "teamName": "CS Thunder Bolts",
  "tournamentId": "{{tournamentId}}",
  "sport": "Cricket",
  "members": [
    {
      "name": "John Doe",
      "rollNumber": "CS001",
      "department": "Computer Science",
      "year": 3,
      "phone": "9876543210",
      "position": "Captain",
      "isCaptain": true
    },
    // ... 10 more members
  ]
}
\`\`\`

## Environment Variables
The collection uses these variables:
- `{{baseUrl}}` - API base URL (http://localhost:5000/api)
- `{{authToken}}` - Student authentication token
- `{{adminToken}}` - Admin authentication token
- `{{tournamentId}}` - Tournament ID (auto-saved)
- `{{teamId}}` - Team ID (auto-saved)
- `{{registrationId}}` - Registration ID (auto-saved)

## Error Testing Scenarios

### 1. Duplicate Registration
Try registering the same captain for the same tournament twice.

### 2. Sport Restriction
Try registering the same captain for multiple tournaments of the same sport.

### 3. Team Size Validation
Try registering a team with more members than allowed.

### 4. Registration Deadline
Try registering after registration end date.

### 5. Duplicate Roll Numbers
Try registering a team with duplicate roll numbers.

## Expected Response Codes
- **200** - Success (GET, PUT)
- **201** - Created (POST)
- **400** - Bad Request (validation errors)
- **401** - Unauthorized (missing/invalid token)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found
- **500** - Server Error

## Testing Tips
1. Run authentication requests first to get tokens
2. Create tournaments before trying to register
3. Use the auto-saved variables for IDs
4. Test error scenarios to ensure validation works
5. Check that only captains can modify their teams
6. Verify admin-only operations are protected
