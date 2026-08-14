SkillSync — Peer-to-Peer Skill Swapping Platform

MERN stack app: MongoDB, Express, React (Vite), Node.js, with Socket.io for real-time chat.

Folder Structure

skillsync/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── matchController.js
│   │   ├── sessionController.js
│   │   ├── reviewController.js
│   │   ├── messageController.js
│   │   ├── reportController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Match.js
│   │   ├── Session.js
│   │   ├── Review.js
│   │   ├── Message.js
│   │   └── Report.js
│   ├── routes/
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── components/
    │   │   ├── Sidebar
    │   │   ├── DashboardLayout
    │   │   └── ProtectedRoute
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── ExploreMatches.jsx
    │   │   ├── MyMatches.jsx
    │   │   ├── MatchDetails.jsx
    │   │   ├── Sessions.jsx
    │   │   └── Profile.jsx
    │   ├── pages/admin/
    │   │   └── AdminOverview.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── postcss.config.js

Live Application

https://skill-sync-seven-peach.vercel.app/

Repository

https://github.com/nkour5308/SkillSync

Setup

1. Backend

cd backend
npm install
npm run dev

The backend runs on http://localhost:5000.

Create a .env file inside the backend folder using .env.example as a reference.

The backend requires a running MongoDB instance and the required environment variables, including the MongoDB connection string and JWT secret.

2. Frontend

cd frontend
npm install
npm run dev

The frontend runs on http://localhost:5173.

The Vite development configuration proxies /api requests to the backend.

What's Implemented

Auth: Register/login with JWT, bcrypt password hashing, and protected routes.

Profile: Bio, city, skills-to-teach / skills-to-learn with level, and badges.

Explore & Match: Non-AI mutual-match logic that surfaces users where your "want to learn" overlaps their "can teach" and vice versa; send, accept, and reject match requests.

Sessions: Schedule from an accepted match, placeholder meeting link, mark sessions as completed/cancelled, and add notes.

Chat: Opens after a match is accepted, with persisted messages and Socket.io live updates.

Reviews: 1–5 star rating after a completed session, updates the ratee's average rating, and supports the "Peer Rated" badge.

Reports: Report a user from the match/chat workflow.

What's Stubbed / Left for Future Extension

Google OAuth: Currently, email/password authentication is implemented.

Real Zoom/Google Meet API integration: Currently, a meeting-link field is used instead of direct video-call integration.

Email notifications / session reminders: Reminder-related schema support exists, but no cron/email sender is wired up.

File upload: Chat attachments and skill proof documents are not currently implemented.

Skill verification workflow: The current implementation uses a manual admin verification/toggle rather than an automated test/document review workflow.
