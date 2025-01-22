# Chat App

Real time chat web app built with MERN stack and Socket.io

## Features

- User Authentication: Creating accounts with email
- Chatting Functionality: Sending and receiving text messages, images, and links
- User Interface: Easy to use & clean user interface
- Updating user info (display name, profile picture, bio)
- Real-time feedback (online status, "is typing...")

## Technologies

1. MongoDB: For storing user information and chat history
2. Express: For building the API endpoints
3. React: For building the frontend user interface
4. Node.js: For running the server-side code
5. Socket.io: For managing the real-time chatting flow
6. JWT: For handling user authentication

# Installation

Follow the steps below to install and setup the project:

1. **Clone the repository**

   Open your terminal and run the following command:

   ```bash
   git clone https://github.com/amanmakhija/chat-application.git
   ```

2. **Install Node.js**

   The project requires Node.js. You can download it from [here](https://nodejs.org/en/download/).

3. **Change the directory**

   ```
   cd chat-application
   ```

4. **Install the required dependencies**

   To install both ends (client/server).

   ```
   npm run init-project
   ```

   Or to install them individually

   ```
   cd frontend
   npm install
   ```

   ```
   cd server
   npm install
   ```

5. **Setup environment variables**

   Rename the `.env.example` file to `.env` in the server directory and add the required environment variables.

   After that create a cluster on the [MongoDB](https://cloud.mongodb.com/) and paste the connection link in the `MONGODB_URL` variable and create a `JWT_SECRET` key.

6. **Run the project**

   Now, you can run the project using the following command:

   To run both ends (client/server).

   ```
   npm run start-project
   ```

   Or to run them individually

   ```bash
   cd server
   npm start
   ```

   ```bash
   cd client
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173) with your browser to see the result.
