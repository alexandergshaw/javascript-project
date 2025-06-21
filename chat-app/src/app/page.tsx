"use client";

import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";

type ExtendedUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  id?: string | null;
};

type ExtendedSession = {
  user?: ExtendedUser;
};

export default function Home() {
  const { data: session } = useSession() as { data: ExtendedSession | null };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        {session ? (
          <div className="flex flex-col items-center gap-2">
            {session.user?.image && (
              <Image
                src={session.user.image}
                alt="Profile"
                width={48}
                height={48}
                style={{ borderRadius: "50%" }}
              />
            )}
            <p>
              <strong>Name:</strong> {session.user?.name}
            </p>
            <p>
              <strong>Email:</strong> {session.user?.email}
            </p>
            <p>
              <strong>User ID:</strong> {session.user?.id}
            </p>
            <button onClick={() => signOut()}>Sign out</button>
          </div>
        ) : (
          <button onClick={() => signIn()}>Sign in</button>
        )}
      </main>
    </div>
  );
}
