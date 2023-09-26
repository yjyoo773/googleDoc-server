# Google Doc Server

## Description

**Google Doc Server** is a backend server application for replicating the functionality of Google Docs. It provides essential features for collaborative document editing and management. This server is built using Node.js and Express.js and uses various libraries and dependencies for authentication, real-time collaboration, and data storage.

## Features

- **User Authentication**: Secure user authentication with JWT (JSON Web Tokens) and password hashing using bcrypt.
- **Real-time Collaboration**: Utilizes WebSocket through Socket.io for real-time document synchronization and collaboration.
- **Database Integration**: Stores and retrieves document data using MongoDB and Mongoose for efficient data management.
- **User Management**: Provides functionality for user creation, updating user profiles, and user deletion.
- **API Endpoints**: Define your API endpoints and routes to interact with the server.

## Installation

To set up and run the server locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/google-doc-server.git
   ```
2. Install dependencies:

    ```bash
    cd google-doc-server
    npm install
    ```
3. Create a .env file for environment variables and configure it with your settings:

```bash
    cp .env.example .env
```
Edit the .env file with your configuration values, including database connection information and secret keys.
## Usage

To start the server in development mode, you can use the following command:

```bash
npm run devStart
```
This will start the server using Nodemon, which automatically restarts the server when you make changes to your code.

## License
This project is licensed under the ISC License.