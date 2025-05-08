# AI-TOOLS Backend

This is the backend service for AI-TOOLS, a Node.js application built with Express and MongoDB.

## Prerequisites

Before running the application, make sure you have the following installed:

- Node.js (v14 or newer)
- MongoDB (local instance or connection string to MongoDB Atlas)
- npm or yarn

## Setup

1. Clone the repository and navigate to the backend directory

```bash
git clone <repository-url>
cd backend
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory with the following variables:

```
# Server Configuration
PORT=8000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/ai-tools

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=30d

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Email Configuration (for password reset)
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@example.com
EMAIL_PASSWORD=your_email_password
EMAIL_FROM="AI-TOOLS" <noreply@ai-tools.com>

# Frontend URL (for password reset links)
FRONTEND_URL=http://localhost:5173
```

## Running the Application

Start the development server:

```bash
npm run dev
# or
yarn dev
```

For production:

```bash
npm run build
npm start
# or
yarn build
yarn start
```

The server will start at `http://localhost:8000` by default (or the port specified in your .env file).

## Creating Users with createUser.ts

The `createUser.ts` script provides a simple way to create users directly in the database without going through the API:

1. Open `src/createUser.ts` and modify the example user at the bottom of the file:

```typescript
// Change these values to create your desired user
createUser("username", "email@example.com", "password123")
```

2. Run the script with ts-node:

```bash
npx ts-node src/createUser.ts
```

You should see a success message when the user is created successfully.

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user profile (protected)
- `POST /auth/forgot-password` - Request password reset
- `PUT /auth/reset-password/:resetToken` - Reset password with token

### Health Check

- `GET /health` - Check server status

## Error Handling

The API returns appropriate HTTP status codes and error messages in JSON format:

```json
{
  "success": false,
  "message": "Error message details"
}
```

## Security Notes

- Password reset tokens expire after 1 hour
- Passwords are hashed using bcrypt before storage
- JWT tokens are used for authentication with configurable expiration
