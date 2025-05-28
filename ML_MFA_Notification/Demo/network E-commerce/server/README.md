# ShopEasy Authentication Server

This is the backend authentication server for the ShopEasy e-commerce platform. It provides user authentication, account management, and password reset functionality.

## Features

- User registration
- User login with account lockout protection
- Password reset via email
- Secure password storage with bcrypt
- JWT authentication

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

### Installing Node.js and npm

Before you can run the server, you need to install Node.js and npm:

1. **Download Node.js**:
   - Visit [https://nodejs.org/](https://nodejs.org/)
   - Download the LTS (Long Term Support) version
   - Run the installer
   - **Important**: Make sure to check the option to "Add to PATH" during installation

2. **Verify Installation**:
   After installation, open a new command prompt/terminal and verify that Node.js and npm are installed:
   ```
   node --version
   npm --version
   ```
   Both commands should display version numbers.

### Setting Up the Server

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

   If you encounter any errors with npm, try:
   ```
   node ./node_modules/npm/bin/npm-cli.js install
   ```

   Or if you have yarn installed:
   ```
   yarn install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the values in `.env` with your configuration

## Configuration

Update the `.env` file with your specific configuration:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/shopeasy
JWT_SECRET=your_jwt_secret_key_here
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
CLIENT_URL=http://localhost:3000
```

- `PORT`: The port on which the server will run
- `MONGO_URI`: Your MongoDB connection string
- `JWT_SECRET`: A secret key for JWT token generation
- `EMAIL_SERVICE`: Email service provider (e.g., gmail, outlook)
- `EMAIL_USER`: Your email address for sending password reset emails
- `EMAIL_PASS`: Your email password or app password
- `CLIENT_URL`: The URL of your frontend application

## Running the Server

### Development Mode

```
npm run dev
```

This will start the server with nodemon, which automatically restarts the server when changes are detected.

### Production Mode

```
npm start
```

## API Endpoints

### Authentication

- **POST /api/auth/register**
  - Register a new user
  - Body: `{ firstName, lastName, email, password }`

- **POST /api/auth/login**
  - Login a user
  - Body: `{ email, password }`

- **POST /api/auth/forgotpassword**
  - Request a password reset
  - Body: `{ email }`

- **PUT /api/auth/resetpassword/:resettoken**
  - Reset password with token
  - Body: `{ password }`

## Security Features

### Password Storage

Passwords are hashed using bcrypt before being stored in the database.

### Account Lockout

After 3 failed login attempts, a user's account will be locked for 5 minutes.

### Password Reset

Password reset tokens are valid for 10 minutes and can only be used once.

## Connecting to Frontend

The frontend should make API requests to the endpoints listed above. Make sure CORS is properly configured if your frontend is running on a different domain or port.

## Troubleshooting

- **MongoDB Connection Issues**: Ensure MongoDB is running and the connection string is correct
- **Email Sending Issues**: If using Gmail, you may need to enable "Less secure app access" or use an App Password
- **CORS Errors**: Check that the frontend origin is properly configured in the CORS settings

## License

This project is licensed under the MIT License.
