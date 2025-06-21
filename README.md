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