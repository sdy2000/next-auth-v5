import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LoginButton } from "@/components/auth";
import { ModeToggle } from "@/components";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export default function Home() {
  return (
    <div className="h-full bg-gradient-to-r from-blue-800 via-sky-700 to-blue-800 dark:from-slate-800 dark:via-gray-700 dark:to-slate-800">
      <div className="flex justify-end p-5">
        <ModeToggle />
      </div>
      <main className="flex h-[90%] flex-col items-center justify-center">
        <div className="space-y-6 text-center">
          <h1
            className={cn(
              "text-6xl font-semibold text-white drop-shadow-md",
              font.className
            )}
          >
            🔐 Auth
          </h1>
          <p className="text-white text-lg">A simple authentication service</p>
          <div>
            <LoginButton>
              <Button variant="secondary" size="lg">
                Sign in
              </Button>
            </LoginButton>
          </div>
        </div>
      </main>
    </div>
  );
}
