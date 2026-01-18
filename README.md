# Real-Time Chat Application

A full-stack real-time chat application built with the MEAN stack (MongoDB, Express.js, Angular, Node.js) featuring WebSocket support for instant messaging. This application enables users to register, authenticate, and engage in real-time one-on-one conversations with other registered users.

## Features

- **User Authentication** - Secure registration and login with JWT tokens
- **Real-Time Messaging** - Instant message delivery using Socket.IO
- **User Management** - View and chat with all registered users
- **Message Persistence** - All messages are saved to MongoDB
- **Auto-Refresh** - Automatic message polling for reliable message delivery
- **Modern UI** - Clean and responsive interface built with Bootstrap 5
- **Protected Routes** - Route guards to protect authenticated pages
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Message History** - View conversation history with any user
- **User List** - Browse and select users to chat with

## Tech Stack

### Frontend
- **Angular 20** - Modern web framework with standalone components
- **TypeScript** - Type-safe JavaScript
- **Bootstrap 5.3.8** - Responsive UI framework
- **Socket.IO Client 4.8.3** - Real-time communication
- **RxJS 7.8.0** - Reactive programming for async operations

### Backend
- **Node.js** - JavaScript runtime
- **Express.js 5.2.1** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose 9.1.3** - MongoDB object modeling
- **Socket.IO 4.8.3** - Real-time bidirectional communication
- **JWT (jsonwebtoken 9.0.3)** - JSON Web Tokens for authentication
- **bcryptjs 3.0.3** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (v6 or higher) - Comes with Node.js
- **MongoDB** - Local installation or MongoDB Atlas account - [Download](https://www.mongodb.com/try/download/community)
- **Angular CLI** (v20 or higher) - Install globally: `npm install -g @angular/cli`

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

The client environment files are located in `client/src/enviroments/`:

- **Development** (`enviroment.development.ts`):
  ```typescript
  export const environment = {
    baseURL: 'http://localhost:3000',
    production: false
  };
  ```

- **Production** (`enviroment.ts`):
  ```typescript
  export const environment = {
    baseURL: 'http://localhost:3000', // Update with your production server URL
    production: true
  };
  ```

## Running the Application

### Development Mode

1. **Start MongoDB** (if using local MongoDB)
   ```bash
   # Windows
   mongod
   
   # macOS/Linux
   sudo systemctl start mongod
   # or
   mongod --dbpath /path/to/data/directory
   ```

2. **Start the server** (Terminal 1)
   ```bash
   cd server
   npm run dev
   ```
   The server will run on `http://localhost:3000`
   - Uses `nodemon` for automatic server restarts on file changes

3. **Start the client** (Terminal 2)
   ```bash
   cd client
   npm start
   ```
   The client will run on `http://localhost:4200`
   - The application will automatically reload when you modify source files

4. **Open your browser**
   Navigate to `http://localhost:4200`

### Production Mode

1. **Build the Angular application**
   ```bash
   cd client
   npm run build
   ```
   This creates optimized production files in `client/dist/`

2. **Start the server**
   ```bash
   cd server
   npm start
   ```

## Project Structure

```
Chat-App/
├── client/                          # Angular frontend application
│   ├── src/
│   │   ├── app/
│   │   │   ├── auth/                # Authentication components
│   │   │   │   ├── login-component/ # Login page
│   │   │   │   └── register-component/ # Registration page
│   │   │   ├── chat/                # Chat component
│   │   │   │   └── chat-component/  # Main chat interface
│   │   │   └── core/                # Core functionality
│   │   │       ├── guards/          # Route guards (auth-guard)
│   │   │       ├── interceptors/    # HTTP interceptors (auth-interceptor)
│   │   │       ├── interfaces/      # TypeScript interfaces
│   │   │       │   ├── auth-response.ts
│   │   │       │   ├── message.ts
│   │   │       │   └── user.ts
│   │   │       └── services/        # Angular services
│   │   │           ├── auth-service.ts
│   │   │           ├── chat-service.ts
│   │   │           └── socket-service.ts
│   │   ├── enviroments/             # Environment configuration
│   │   │   ├── enviroment.ts
│   │   │   └── enviroment.development.ts
│   │   ├── index.html
│   │   ├── main.ts                  # Application entry point
│   │   └── styles.css
│   ├── angular.json
│   ├── package.json
│   └── tsconfig.json
│
├── server/                          # Node.js backend application
│   ├── controllers/                 # Route controllers
│   │   ├── authController.js        # Authentication logic
│   │   └── chatController.js        # Chat logic
│   ├── middleware/                  # Express middleware
│   │   └── authMiddleware.js        # JWT authentication middleware
│   ├── models/                      # Mongoose models
│   │   ├── User.js                  # User schema
│   │   └── Message.js               # Message schema
│   ├── routes/                      # Express routes
│   │   ├── authRoutes.js            # Authentication routes
│   │   └── chatRoutes.js            # Chat routes
│   ├── utils/                       # Utility functions
│   │   ├── ApiError.js              # Error handling
│   │   └── generateToken.js         # JWT token generation
│   ├── socket.js                    # Socket.IO configuration
│   ├── server.js                    # Server entry point
│   ├── package.json
│   └── .env                         # Environment variables (create this)
│
├── README.md                        # This file
└── TESTING_GUIDE.md                 # Testing instructions
```

## API Endpoints

### Authentication Endpoints

#### Register a new user
- **Endpoint:** `POST /api/auth/register`
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "user_id",
      "username": "john_doe",
      "email": "john@example.com"
    }
  }
  ```

#### Login user
- **Endpoint:** `POST /api/auth/login`
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "user_id",
      "username": "john_doe",
      "email": "john@example.com"
    }
  }
  ```

### Chat Endpoints

All chat endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Get all users
- **Endpoint:** `GET /api/chat/users`
- **Auth Required:** Yes
- **Response:**
  ```json
  [
    {
      "_id": "user_id",
      "username": "john_doe",
      "email": "john@example.com"
    }
  ]
  ```

#### Get messages with a specific user
- **Endpoint:** `GET /api/chat/messages/:userId`
- **Auth Required:** Yes
- **URL Parameters:** `userId` - The ID of the user to get messages with
- **Response:**
  ```json
  [
    {
      "_id": "message_id",
      "sender": "sender_id",
      "receiver": "receiver_id",
      "content": "Hello, how are you?",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
  ```

#### Send a message
- **Endpoint:** `POST /api/chat/message`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "receiverId": "user_id_here",
    "content": "Hello, how are you?"
  }
  ```
- **Response:**
  ```json
  {
    "_id": "message_id",
    "sender": "sender_id",
    "receiver": "receiver_id",
    "content": "Hello, how are you?",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
  ```

## Authentication Flow

1. User registers or logs in through the Angular frontend
2. Server validates credentials and returns a JWT token
3. Token is stored in browser `localStorage`
4. `AuthInterceptor` automatically attaches token to all HTTP requests
5. Socket.IO connection is established with token in auth header
6. Protected routes (like `/chat`) are guarded by `AuthGuard`
7. If token is invalid or expired, user is redirected to login

## Socket.IO Events

### Client → Server Events

#### Join user room
- **Event:** `join`
- **Payload:**
  ```javascript
  {
    userId: "user_id"
  }
  ```

#### Send message
- **Event:** `sendMessage`
- **Payload:**
  ```javascript
  {
    receiverId: "user_id",
    content: "Message content"
  }
  ```

### Server → Client Events

#### Receive new message
- **Event:** `receiveMessage`
- **Payload:**
  ```javascript
  {
    _id: "message_id",
    sender: "sender_id",
    receiver: "receiver_id",
    content: "Message content",
    createdAt: "2024-01-01T00:00:00.000Z"
  }
  ```

## Testing

### Testing with Multiple Users

To test the chat functionality properly, you **MUST** use **separate browser instances**:

1. **Option 1: Different Browsers** (Recommended)
   - Open Chrome and log in as User A
   - Open Firefox/Edge and log in as User B

2. **Option 2: Incognito/Private Mode**
   - Open a regular window and log in as User A
   - Open an incognito/private window and log in as User B

3. **Option 3: Different Browser Profiles**
   - Use separate Chrome profiles for each user

**Why?** The browser shares `localStorage` (where tokens are stored), so using the same browser/tab will cause conflicts.

For detailed testing instructions, see [TESTING_GUIDE.md](./TESTING_GUIDE.md)

## Available Scripts

### Server Scripts
- `npm start` - Start the server in production mode
- `npm run dev` - Start the server in development mode with nodemon

### Client Scripts
- `npm start` - Start the development server (runs `ng serve`)
- `npm run build` - Build the application for production
- `npm run watch` - Build and watch for changes
- `npm test` - Run unit tests

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation if needed

## Author

**Amany Elsayed**
- GitHub: [@Amany-Elsayed](https://github.com/Amany-Elsayed)
- Junior MEAN Stack Developer

## Acknowledgments

- [Socket.IO](https://socket.io/) - Real-time communication library
- [Angular](https://angular.io/) - Web application framework
- [Bootstrap](https://getbootstrap.com/) - CSS framework
- [MongoDB](https://www.mongodb.com/) - Database solution
- [Express.js](https://expressjs.com/) - Web framework
- [Mongoose](https://mongoosejs.com/) - MongoDB object modeling

