# Project TODO

---

## Step 1: Basic Next.js App
**Goal:** Set up a new Next.js project and deploy a simple homepage to Vercel.

**Tasks:**
- npx create-next-app@latest
- Add a simple homepage (pages/index.js)
- Deploy to Vercel to confirm setup

---

## Step 2: User Authentication
**Goal:** Add authentication using NextAuth.js.

**Tasks:**
- Install NextAuth.js
- Set up email/password or OAuth (Google/GitHub) login
- Add sign-in/sign-out UI
- Test login/logout flow

---

## Step 3: MongoDB Integration
**Goal:** Connect to MongoDB Atlas and store user profiles.

**Tasks:**
- Set up MongoDB Atlas cluster
- Install Mongoose and connect in Next.js API routes
- Create User schema/model
- On sign-up, store user info in MongoDB
- Fetch/display user profile info

---

## Step 4: Chat Room CRUD
**Goal:** Allow users to create, list, and join chat rooms.

**Tasks:**
- Create ChatRoom schema/model
- API routes for creating/listing/joining rooms
- UI for creating/joining rooms
- Display list of available/joined rooms

---

## Step 5: Real-time Messaging (Socket.io)
**Goal:** Enable real-time messaging in chat rooms.

**Tasks:**
- Set up Socket.io server (can use a custom server or a separate microservice)
- Connect frontend to Socket.io
- Send/receive messages in real time
- Display messages in chat room UI

---

## Step 6: Message Persistence
**Goal:** Store and retrieve chat messages from MongoDB.

**Tasks:**
- Create Message schema/model
- On message send, save to MongoDB via API route
- On room join, fetch message history
- Display persisted messages in chat UI

---

## Step 7: User Presence & Notifications
**Goal:** Show online users and notify about new messages.

**Tasks:**
- Track user online/offline status (Socket.io events)
- Display online users in room
- Show in-app notifications for new messages

---

## Step 8: Polish & Extras
**Goal:** Add avatars, file uploads, dark mode, etc.

**Tasks:**
- Add user avatars (upload or use Gravatar)
- Implement file/image uploads (Cloudinary/S3)
- Add dark mode toggle