import type { PropsWithChildren } from "react";

export const PageLayout = (props: PropsWithChildren) => {
  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-black border-b border-gray-200 py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold">Salem</h1>
        </div>
      </header>
      <main className="max-w-3xl mx-auto py-4 px-2">{props.children}</main>
    </div>
  );
};
