import type { PropsWithChildren } from "react";

export const PageLayout = (props: PropsWithChildren) => {
    return(
    <main className="h-screen flex justify-center">
        <div className="md:w-full border-slate-400 h-full max-w-2xl border-x overflow-y-scroll"> 
                {props.children}
            </div>
    </main>
    );
}