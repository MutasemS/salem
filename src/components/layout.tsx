import type { PropsWithChildren } from "react";
import { SignInButton, useUser } from "@clerk/nextjs";
import {SignOutButton } from "@clerk/nextjs";

export const PageLayout = (props: PropsWithChildren) => {
  const {isLoaded: userLoaded, isSignedIn} = useUser();
  if(!userLoaded) return <div/>
  
  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-black border-b border-gray-200 py-2 px-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-white">Salem</h1>
        {isSignedIn && <SignOutButton />}
        {!isSignedIn && <SignInButton />}
      </header>
      <main className="max-w-3xl mx-auto py-4 px-2">{props.children}</main>
    </div>
  );
};
