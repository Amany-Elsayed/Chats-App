# Real-Time Chat Application

A full-stack real-time chat application built with the MEAN stack (MongoDB, Express.js, Angular, Node.js) featuring WebSocket support for instant messaging.

## Features

- **User Authentication** - Secure registration and login with JWT tokens
- **Real-Time Messaging** - Instant message delivery using Socket.IO
- **User Management** - View and chat with all registered users
- **Auto-Refresh** - Automatic message polling for reliable message delivery
- **Message Persistence** - All messages are saved to MongoDB
- **Modern UI** - Clean and responsive interface built with Bootstrap
- **Protected Routes** - Route guards to protect authenticated pages
- **Responsive Design** - Works seamlessly on desktop and mobile devices

## Tech Stack

### Frontend
- **Angular 20** - Modern web framework
- **TypeScript** - Type-safe JavaScript
- **Bootstrap 5** - Responsive UI framework
- **Socket.IO Client** - Real-time communication
- **RxJS** - Reactive programming

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Socket.IO** - Real-time bidirectional communication
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** (v6 or higher) or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)
- **Angular CLI** (v20 or higher) - `npm install -g @angular/cli`

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Chat-App.git
   cd Chat-App
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

## Configuration

### Server Configuration

1. Navigate to the `server` directory
2. Create a `.env` file in the `server` directory:
   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/chat-app
   JWT_SECRET=your-secret-jwt-key-change-this-in-production
   ```

### Client Configuration

1. Navigate to the `client/src/enviroments` directory
2. Update `enviroment.ts` and `enviroment.development.ts`:
   ```typescript
   export const environment = {
     baseURL: 'http://localhost:3000'
   };
   ```

   **For production**, update the `baseURL` to your server's URL.

## Running the Application

### Development Mode

1. **Start MongoDB** (if using local MongoDB)
   ```bash
   mongod
   ```

2. **Start the server**
   ```bash
   cd server
   npm run dev
   ```
   The server will run on `http://localhost:3000`

3. **Start the client** (in a new terminal)
   ```bash
   cd client
   npm start
   ```
   The client will run on `http://localhost:4200`

4. **Open your browser**
   Navigate to `http://localhost:4200`

### Production Mode

1. **Build the Angular application**
   ```bash
   cd client
   npm run build
   ```

2. **Start the server**
   ```bash
   cd server
   npm start
   ```

## Project Structure

```
Chat-App/
├── client/                 # Angular frontend application
│   ├── src/
│   │   ├── app/
│   │   │   ├── auth/       # Authentication components (login, register)
│   │   │   ├── chat/       # Chat component
│   │   │   └── core/       # Core services, guards, interceptors
│   │   └── enviroments/    # Environment configuration
│   └── package.json
│
├── server/                 # Node.js backend application
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Authentication middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # Express routes
│   ├── socket.js           # Socket.IO configuration
│   ├── server.js           # Server entry point
│   └── package.json
│
└── README.md
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
  ```json
  {
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `POST /api/auth/login` - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

### Chat

- `GET /api/chat/users` - Get all users (requires authentication)
- `GET /api/chat/messages/:userId` - Get messages with a specific user (requires authentication)
- `POST /api/chat/message` - Send a message (requires authentication)
  ```json
  {
    "receiverId": "user_id_here",
    "content": "Hello, how are you?"
  }
  ```

## Testing

### Testing with Multiple Users

To test the chat functionality properly, you need to use **separate browser instances**:

1. **Option 1: Different Browsers**
   - Open Chrome and log in as User A
   - Open Firefox/Edge and log in as User B

2. **Option 2: Incognito Mode**
   - Open a regular window and log in as User A
   - Open an incognito/private window and log in as User B

3. **Option 3: Different Browser Profiles**
   - Use separate Chrome profiles for each user

**Why?** The browser shares `localStorage` (where tokens are stored), so using the same browser/tab will cause conflicts.

For detailed testing instructions, see [TESTING_GUIDE.md](./TESTING_GUIDE.md)

## Authentication Flow

1. User registers/logs in
2. Server returns JWT token
3. Token is stored in `localStorage`
4. Token is sent with every API request via `AuthInterceptor`
5. Socket connection is established with token in auth header
6. Protected routes are guarded by `AuthGuard`

## Socket.IO Events

### Client → Server
- `sendMessage` - Send a message to another user
  ```javascript
  {
    receiverId: "user_id",
    content: "Message content"
  }
  ```

### Server → Client
- `receiveMessage` - Receive a new message
  ```javascript
  {
    _id: "message_id",
    sender: "sender_id",
    receiver: "receiver_id",
    content: "Message content",
    createdAt: "2024-01-01T00:00:00.000Z"
  }
  ```

## Troubleshooting

### Messages not appearing in real-time
- Ensure both users are using different browsers/incognito windows
- Check browser console for errors
- Verify socket connection in server logs
- The app uses polling as a fallback (checks every 2 seconds)

### Socket connection errors
- Verify `JWT_SECRET` is set in `.env`
- Check MongoDB connection string
- Ensure CORS is properly configured
- Check that the server is running on the correct port

### Authentication issues
- Clear browser `localStorage`
- Verify JWT token is being sent in requests
- Check server logs for authentication errors

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## Author

Amany Elsayed - [GitHub](https://github.com/Amany-Elsayed)

## Acknowledgments

- Socket.IO for real-time communication
- Angular team for the amazing framework
- Bootstrap for the UI components
- MongoDB for the database solution

---

**Note:** This is a learning project. For production use, consider:
- Adding input validation and sanitization
- Implementing rate limiting
- Adding message encryption
- Implementing file uploads
- Adding user presence indicators
- Implementing message read receipts
- Adding group chat functionality
