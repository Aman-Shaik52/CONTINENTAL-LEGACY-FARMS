# Continental Legacy Farm's

A full-stack MERN eCommerce web application for selling rare and extinct fruits, vegetables, dairy products, and unique food items worldwide.

## Features

- User authentication (register/login)
- Product catalog with filtering by category, rarity, and origin
- Shopping cart functionality
- Admin dashboard for managing products
- Responsive design with Tailwind CSS

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, React Router
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Authentication:** JWT

## Getting Started

### Prerequisites

- Node.js
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

### Running the Application

1. Start MongoDB locally (if not already running)
2. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```
3. Start the frontend (in a new terminal):
   ```bash
   cd frontend
   npm run dev
   ```
4. The browser will automatically open at `http://localhost:5173`

**Important:** Do NOT use Live Server or any directory listing tool. Always run the React app using `npm run dev` in the frontend directory.

## Deployment

- **Frontend:** Deploy to Vercel
- **Backend:** Deploy to Render or AWS

## License

ISC