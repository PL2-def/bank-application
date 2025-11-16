# Bank Application

This is a full-stack bank application built with React, TypeScript, and Vite for the frontend, and Node.js with Express and TypeScript for the backend.

## Features

*   **User Authentication:** Secure login and registration for users.
*   **Dashboard:** Overview of user accounts and recent activities.
*   **Accounts Management:** View and manage bank accounts.
*   **Loans:** Functionality related to loan applications and management.
*   **Transfers:** Securely transfer funds between accounts.

## Technologies Used

### Frontend
*   React
*   TypeScript
*   Vite
*   ESLint (for code quality)

### Backend
*   Node.js
*   Express
*   TypeScript

## Setup

Follow these steps to set up and run the application locally.

### Prerequisites

*   Node.js (LTS version recommended)
*   npm or yarn

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd bank-application
```

### 2. Install Frontend Dependencies

Navigate to the project root and install dependencies:

```bash
cd C:\Users\enzo\Documents\bank
npm install
# or yarn install
```

### 3. Install Backend Dependencies

Navigate to the `backend` directory and install dependencies:

```bash
cd C:\Users\enzo\Documents\bank\backend
npm install
# or yarn install
```

### 4. Environment Variables

Create a `.env` file in the root of the project (C:\Users\enzo\Documents\bank) if needed for frontend environment variables.
Create a `.env` file in the `backend` directory (C:\Users\enzo\Documents\bank\backend) if needed for backend environment variables (e.g., database connection strings, JWT secrets).

Example `.env` for backend:
```
PORT=3000
JWT_SECRET=your_jwt_secret_key
```

## Running the Application

### 1. Start the Backend Server

From the `backend` directory:

```bash
cd C:\Users\enzo\Documents\bank\backend
npm run dev
# or yarn dev
```
The backend server will typically run on `http://localhost:3000` (or the port specified in your `.env` file).

### 2. Start the Frontend Development Server

From the project root directory:

```bash
cd C:\Users\enzo\Documents\bank
npm run dev
# or yarn dev
```
The frontend application will typically open in your browser at `http://localhost:5173` (or another port if 5173 is in use).

## Project Structure

```
.
├── backend/                # Node.js/Express backend
│   ├── src/                # Backend source code
│   ├── package.json        # Backend dependencies and scripts
│   └── ...
├── public/                 # Static assets for frontend
├── src/                    # React frontend source code
│   ├── components/         # Reusable React components
│   ├── contexts/           # React Context API for global state
│   ├── pages/              # Page-specific React components
│   ├── services/           # API service integrations
│   ├── types/              # TypeScript type definitions
│   └── ...
├── package.json            # Frontend dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
└── ...
```