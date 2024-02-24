"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

import { ModeToggle } from "@/components";
import { UserButton } from "@/components/auth";

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="bg-secondary flex justify-between items-center p-4 rounded-xl w-[600px] shadow-sm">
      <div className="flex gap-x-2">
        <Button
          asChild
          variant={pathname === "/server" ? "default" : "outline"}
        >
          <Link href="/server">Server</Link>
        </Button>
        <Button
          asChild
          variant={pathname === "/client" ? "default" : "outline"}
        >
          <Link href="/client">Client</Link>
        </Button>
        <Button asChild variant={pathname === "/admin" ? "default" : "outline"}>
          <Link href="/admin">Admin</Link>
        </Button>
        <Button
          asChild
          variant={pathname === "/settings" ? "default" : "outline"}
        >
          <Link href="/settings">Settings</Link>
        </Button>
      </div>
      <div className="flex justify-between items-center gap-4">
        <ModeToggle />
        <UserButton />
      </div>
    </nav>
  );
};
