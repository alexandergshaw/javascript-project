This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Authentication Setup (NextAuth.js)

This project uses [NextAuth.js](https://next-auth.js.org/) for authentication with Google and GitHub OAuth.

## 1. Install NextAuth.js

```bash
npm install next-auth
```

---

## 2. Create the NextAuth API Route

Create the following file:

```
/src/pages/api/auth/[...nextauth].js
```

Add this code:

```js
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
});
```

---

## 3. Register OAuth Apps

### Google

- Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
- Create an OAuth 2.0 Client ID (Web application)
- Set **Authorized redirect URI**:  
  ```
  http://localhost:3000/api/auth/callback/google
  ```
- Copy your **Client ID** and **Client Secret**

### GitHub

- Go to [GitHub Developer Settings](https://github.com/settings/developers)
- Click "New OAuth App"
- Set **Homepage URL**:  
  ```
  http://localhost:3000
  ```
- Set **Authorization callback URL**:  
  ```
  http://localhost:3000/api/auth/callback/github
  ```
- Copy your **Client ID** and **Client Secret**

---

## 4. Add Environment Variables

Create a `.env.local` file in your project root:

```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret
NEXTAUTH_URL=http://localhost:3000
```

Replace the values with your actual credentials.

> **Note:**  
> If you are running this project in GitHub Codespaces or any remote environment, set `NEXTAUTH_URL` in your `.env.local` to your Codespace’s public URL (e.g., `https://your-codespace-id-3000.app.github.dev/`).  
> Also, update your Google and GitHub OAuth app callback URLs to match this

---

## 5. Wrap Your App with SessionProvider

- Create a client component `SessionProviderWrapper` in `/src/components/SessionProviderWrapper.tsx`:

```tsx
"use client";
import { SessionProvider } from "next-auth/react";
import React from "react";

export default function SessionProviderWrapper({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

- Import and use it in `/src/app/layout.tsx`:

```tsx
import SessionProviderWrapper from "../components/SessionProviderWrapper";
// ...other imports...

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProviderWrapper>
          {children}
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
```

---

## 6. Use Auth Hooks in Client Components

- In any component where you want to use authentication (e.g., `/src/app/page.tsx`), add `"use client"` at the top:

```tsx
"use client";
import { useSession, signIn, signOut } from "next-auth/react";

// ...component code...
```

---

## 7. Restart the Dev Server

After any changes to `.env.local` or API routes, restart your server:

```bash
npm run dev
```

---

You should now have working Google and GitHub authentication in your Next.js app!


---

# MongoDB Integration (User Profiles)

This section explains how to connect your Next.js app to MongoDB Atlas using Mongoose and store user profiles.

## 1. Set Up MongoDB Atlas

- Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a free cluster
- Create a database user and password
- Get your connection string (e.g., `mongodb+srv://<user>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority`)

## 2. Add MongoDB URI to `.env.local`

Add this line to your `.env.local`:
```
MONGODB_URI=your-mongodb-connection-string
```

## 3. Install Mongoose

```bash
npm install mongoose
```

## 4. Create Mongoose Connection Utility

Create `/src/lib/mongodb.js`:
```js
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
```

## 5. Create User Schema/Model

Create `/src/models/User.js`:
```js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: String,
  image: String,
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
```

## 6. Update NextAuth to Store Users in MongoDB

Edit `/src/pages/api/auth/[...nextauth].js`:
```js
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import dbConnect from "../../../lib/mongodb";
import User from "../../../models/User";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      await dbConnect();
      await User.findOneAndUpdate(
        { email: user.email },
        { $set: { name: user.name, image: user.image } },
        { upsert: true, new: true }
      );
      return true;
    },
    async session({ session }) {
      await dbConnect();
      const dbUser = await User.findOne({ email: session.user.email });
      session.user.id = dbUser?._id;
      return session;
    },
  },
});
```

## 7. Fetch/Display User Profile Info

You can now use `useSession()` in your client components to access user info, or create an API route to fetch more profile data from MongoDB

> **MongoDB Atlas IP Whitelist Note:**  
> If you see a MongoDB connection error about IP whitelisting, go to your MongoDB Atlas dashboard, navigate to **Network Access**, and add your current IP address or `0.0.0.0/0` (for development only) to the IP Access List.