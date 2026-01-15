# MEAN Chat App -- Backend

A simple and fast real-time chat backend built with
**Node.js, Express, MongoDB, and Socket.IO**.\

------------------------------------------------------------------------

## Features

-   User registration & login (JWT authentication)
-   Password hashing using bcrypt
-   Protected routes with auth middleware
-   One-to-one real-time chat using Socket.IO
-   Message persistence with MongoDB
-   Clean MVC-style folder structure
-   Environment variable configuration
-   Express async error handling

------------------------------------------------------------------------

## Tech Stack

-   Node.js
-   Express
-   MongoDB & Mongoose
-   Socket.IO
-   JWT (jsonwebtoken)
-   bcryptjs
-   dotenv
-   express-async-handler

------------------------------------------------------------------------

## Project Structure

    server/
    ├── controllers/
    │   ├── authController.js
    │   └── chatController.js
    ├── middleware/
    │   └── authMiddleware.js
    ├── models/
    │   ├── User.js
    │   └── Message.js
    ├── routes/
    │   ├── authRoutes.js
    │   └── chatRoutes.js
    ├── utils/
    │   ├── ApiError.js
    │   └── generateToken.js
    ├── socket.js
    ├── server.js
    ├── socket-test.html
    ├── .env
    ├── package.json
    └── package-lock.json

------------------------------------------------------------------------

## Environment Variables

Create a `.env` file in the root of the `server` folder:

    PORT=3000
    MONGO_URI=mongodb://127.0.0.1:27017/chatApp
    JWT_SECRET=your_secret_key

------------------------------------------------------------------------

## Installation

``` bash
npm install
```

------------------------------------------------------------------------

## Run the Server

``` bash
node server.js
```

The server will run on:

    http://localhost:3000

------------------------------------------------------------------------

## Authentication Endpoints

### Register

    POST /api/auth/register

### Login

    POST /api/auth/login

Login returns a JWT token that must be sent in the `Authorization`
header:

    Authorization: Bearer YOUR_TOKEN

------------------------------------------------------------------------

## Chat Endpoints

### Get Users

    GET /api/chat/users

### Get Messages with a User

    GET /api/chat/messages/:userId

(All chat routes are protected)

------------------------------------------------------------------------

## Real-Time Messaging (Socket.IO)

### Socket Events

-   `join` → Join user room
-   `sendMessage` → Send message
-   `newMessage` → Receive message

Messages are saved to MongoDB and delivered in real time.

You can test sockets using the included `socket-test.html` file.

------------------------------------------------------------------------

## Testing

-   REST APIs tested using Postman
-   Socket.IO tested using two browser tabs
-   Database inspected using MongoDB Compass

------------------------------------------------------------------------

## Contributing

Feel free to fork this project and customize it for your needs. If you have suggestions for improvements, pull requests are welcome!

## Contact

For questions or support, please open an issue in the repository.

## Author
Amany Elsayed  
Junior MEAN Stack Developer
