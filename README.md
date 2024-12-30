
# CMMS Project

This is the CMMS (Computerized Maintenance Management System) project, which is built using the MERN stack. It includes features for managing work orders, assets, preventive maintenance, and request management.

## Project Structure

The project is organized into two main parts:
- `frontend` - The client-side of the application built with React.js.
- `backend` - The server-side application built with Node.js and Express.

## Prerequisites

Before getting started, make sure you have the following installed:

- **Node.js** (v14 or above)
- **npm** (Node Package Manager)
- **MongoDB** (locally or via MongoDB Atlas for database connection)

## Setup and Installation

Follow these instructions to get the project up and running.

### 1. Clone the repository

First, clone the project repository to your local machine:

```bash
git clone <repository_url>
cd <project_directory>
```

### 2. Install Dependencies

#### Backend Dependencies
Navigate to the `backend` folder and install the required dependencies:

```bash
cd backend
npm install
```

#### Configure .env File 
Navigate to the `backend` folder and rename `.env.example` to `.env`:

```bash
cp .env.example .env
```

#### Frontend Dependencies
Next, navigate to the `frontend` folder and install the required dependencies:

```bash
cd frontend
npm install
```

## Environment Variables

### Backend

Make sure you have a `.env` file in the `backend` directory with the following contents:

```
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>
SECRET_KEY=someRandomStringForJWT
PORT=5000
```

- Replace `<username>` , `<password>` and `<dbname>`with your MongoDB credentials.

## Running the Application

### Start the Backend

To start the backend:

1. Navigate to the `backend` directory:

   ```bash
   cd backend
   ```

2. Run the following command to start the server:

   ```bash
   node ./index.js
   ```

   The server will start and be available on port `5000`.

### Start the Frontend

To start the frontend:

1. Navigate to the `frontend` directory:

   ```bash
   cd frontend
   ```

2. Run the following command to start the development server:

   ```bash
   npm start
   ```

   The frontend will be hosted at [http://localhost:3000](http://localhost:3000).

## Available Scripts

### Frontend

- `npm start` - Runs the React app in development mode.
- `npm run build` - Builds the app for production.
- `npm test` - Runs tests.
- `npm run eject` - Ejects from Create React App (use with caution).

### Backend

- `node ./index.js` - Starts the backend server.

## Troubleshooting

1. **Issue: Server not starting**

   - Check if the MongoDB URI is correct in the `.env` file.
   - Ensure MongoDB is running locally or check your MongoDB Atlas connection.

2. **Issue: Frontend not loading**

   - Make sure you are running the frontend server using `npm start` in the `frontend` directory.

 
