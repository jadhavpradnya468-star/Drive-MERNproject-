# Drive-MERNproject

> A simple file storage / file-sharing backend using Node.js, Express, MongoDB, JWT authentication and EJS templating.

## 🔎 Description

This project allows users to sign up / login, upload and manage files (CRUD), and download them.  
It uses JWT-based authentication (no Firebase) and MongoDB (via Mongoose). Views are rendered using EJS.  

It’s a minimal yet functional starting point for a “drive”-style application that can be extended to a full-fledged storage or file-sharing service.

## 🧰 Tech Stack

- **Node.js** & **Express.js**  
- **MongoDB** (via Mongoose)  
- **JWT** (for authentication)  
- **EJS** (for server-side rendered views)  
- **dotenv** (for environment variables)  
- **Git** for version control  

## 📁 Project Structure

Drive
├── .env                  # Add MONGO_URI and JWT_SECRET here
├── .gitignore
├── README.md
│
├── app.js                # Express app entry point
|── auth.js               # JWT-based auth (instead of Firebase)
├── db.js                 # MongoDB connection using Mongoose
│
├── models/
│   ├── user.model.js     # User schema (name, email, password)
│   └── file.model.js     # File schema (filename, path, owner)
│
├── routes/
│   ├── user.routes.js    # Signup/Login endpoints
│   └── fileRoutes.js     # CRUD for files
│
├── views/
│   ├── home.ejs
│   ├── index.ejs
│   ├── login.ejs
│   ├── register.ejs
│   └── download.ejs


## 🚀 Getting Started (Local Development)

### Prerequisites

- Node.js (with npm) installed  
- MongoDB server (local or remote URI)  
- Git  

### Installation & Setup

 1. Initialize npm & create package.json
npm init -y

 2. Install dependencies your project needs:
npm install express mongoose dotenv jsonwebtoken bcrypt multer ejs

 3. (Optional but useful) Install a dev-dependency like nodemon for development auto-restarts
npm install --save-dev nodemon

 4. Update package.json “scripts” section — for example:

 (you can open package.json, find "scripts", and replace or add:)
 "scripts": {
   "start": "node app.js",
   "dev": "nodemon app.js"
 }

5. After cloning or pulling project later, install dependencies:
npm install

6. To run server in production mode:
npm start

#Then open your browser at:
http://localhost:<PORT>   (default: http://localhost:3000) (https://jadhavpradnya468-star.github.io/Drive-MERNproject/)
example:
http://localhost:3000/register

