SkillSync – Peer-to-Peer Skill Swapping Platform
🚩 Problem

People want to learn valuable skills but can't afford courses. At the same time, many people know something useful they could teach — if only they could exchange skills directly.

🎯 Solution

SkillSync is a platform where users can list skills they can teach and skills they want to learn, then match with others for peer-to-peer learning swaps. Think of it like barter, but for learning.

Live Application: https://skill-sync-seven-peach.vercel.app/

🖥️ Tech Stack

MongoDB – Users, Skills, Matches, Sessions, Reviews
Express + Node.js – Auth, matching logic (non-AI), session handling
React.js – Skill dashboard, match explorer, chat, profile system
🔑 Key Features

👤 User Profile

Login/Register (Google OAuth or email)
Set skills you can teach (with experience level, optional proof)
Set skills you want to learn
Set availability slots
Set city/timezone for better matches
Profile badge system:
Verified Teacher (after X sessions)
Peer Rated (positive reviews)

🔍 Explore & Match

See a list of available swaps:
"You can teach A, they want to learn A"
"They can teach B, you want to learn B"
Mutual match logic (non-AI, rule-based) — matches are only shown when both users' needs align
Match requests with status tracking: Pending, Accepted, Completed

🗓️ Sessions

Request 1:1 sessions
Schedule by selecting from each other's availability
Built-in video call link (Zoom/Google Meet integration or placeholder link)
Track progress with notes, resources, and milestones
Session reminders (email or in-app)

💬 In-app Chat

Chat with matched users
Opens only after a match is accepted
File sharing: docs, PDFs, images

🏅 Verification & Reviews

Peer reviews after sessions (1–5 stars, comments)
Admin skill verification (optional test or document upload)
Complaints/abuse reporting

🔄 User Flow

[Home Page] 
   ↓
[Login/Register] 
   ↓
[Create Profile: Skills to Teach + Learn] 
   ↓
[View Matches] 
   ↓
[Send Match Request] 
   ↓
[Match Accepted] 
   ↓
[Chat Opens + Schedule Session] 
   ↓
[Attend Session] 
   ↓
[Leave Review + Mark as Completed] 
   ↓
[Track Progress → Next Match] 
