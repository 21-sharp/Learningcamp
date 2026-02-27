# Learning Camp LMS

A comprehensive Learning Management System built with the MERN stack.

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB URI (already configured in `Backend/.env`)

### Installation
From the root directory, run:
```bash
npm run install:all
```

### Database Seeding (Optional)
To populate the database with sample courses and exams:
```bash
npm run seed
```

### Running Locally
To start both the Backend and Frontend simultaneously:
```bash
npm run dev
```
The application will be available at:
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:5000](http://localhost:5000)

## Project Structure
- `Backend/`: Node.js/Express server and MongoDB models.
- `frontend/`: React application.
