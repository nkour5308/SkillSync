# SkillSync — Peer-to-Peer Skill Swapping Platform

MERN stack app: MongoDB, Express, React (Vite), Node.js, with Socket.io for real-time chat.

## Folder structure

```
skillsync/
├── backend/
│   ├── config/db.js
│   ├── controllers/        # authController, userController, matchController,
│   │                         sessionController, reviewController, messageController,
│   │                         reportController, adminController
│   ├── middleware/auth.js  # JWT protect + adminOnly
│   ├── models/              # User, Match, Session, Review, Message, Report
│   ├── routes/               # one router file per resource
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── frontend/
    ├── src/
    │   ├── api/axios.js
    │   ├── context/AuthContext.jsx
    │   ├── components/       # Sidebar, DashboardLayout, ProtectedRoute
    │   ├── pages/             # Home, Login, Register, Dashboard, ExploreMatches,
    │   │                        MyMatches, MatchDetails, Sessions, Profile
    │   ├── pages/admin/AdminOverview.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── postcss.config.js
```

## Setup

### 1. Backend

```bash
cd backend
cp .env.example .env     # then fill in MONGO_URI and JWT_SECRET
npm install
npm run dev               # requires nodemon (npm i -g nodemon), or use: npx nodemon server.js
```

Runs on `http://localhost:5000`. Needs a running MongoDB instance (local `mongod`, or a free
MongoDB Atlas cluster — just paste its connection string into `MONGO_URI`).

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173` and proxies `/api` calls to the backend.

### 3. Make yourself an admin

Register a normal account through the UI, then in MongoDB (e.g. via `mongosh` or Compass) run:

```js
db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })
```

Log out and back in — you'll now see the Admin Panel link in the sidebar.

## What's implemented

- **Auth**: register/login with JWT, bcrypt password hashing, protected routes
- **Profile**: bio, city, skills-to-teach / skills-to-learn (with level), badges
- **Explore & Match**: non-AI mutual-match logic — surfaces users where your "want to learn"
  overlaps their "can teach" and vice versa; send/accept/reject match requests
- **Sessions**: schedule from an accepted match, placeholder meeting link, mark
  completed/cancelled, notes field
- **Chat**: opens only after a match is accepted, persisted messages + Socket.io live updates
- **Reviews**: 1–5 star rating after a completed session, auto-updates the ratee's average
  and unlocks the "Peer Rated" badge
- **Reports**: report a user from the match/chat screen
- **Admin panel**: stats overview, top skills, user list with block/unblock and manual
  "Verified Teacher" badge, report queue with resolve action

## What's stubbed / left for you to extend

- Google OAuth (currently email/password only)
- Real Zoom/Google Meet API integration (currently a placeholder link field)
- Email notifications / session reminders (schema field `reminderSent` is there, no cron/email
  sender wired up yet)
- File upload for chat attachments and skill "proof" documents (schema fields exist, no
  upload endpoint yet — wire up `multer`, already in `package.json`)
- Skill verification via test/document review workflow (currently a manual admin toggle)
