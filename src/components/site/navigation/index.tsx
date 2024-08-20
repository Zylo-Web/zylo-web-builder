import { ModeToggle } from "@/components/global/mode-toggle";
import { SignedOut, UserButton } from "@clerk/nextjs";
import { currentUser, User } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  user?: null | User;
};
const Navigation = ({ user }: Props) => {
  const userss = currentUser();

  return (
    <div className="p-4 flex items-center justify-between relative">
      <aside className="flex items-center gap-2">
        <Image
          src={"./assets/zylo-logo.svg"}
          height={40}
          width={40}
          alt="Zylo logo"
        />
        <span className="text-xl font-bold">Zylo.</span>
      </aside>
      <nav className="hidden md:block absolute left-[50%] top-[50%] transform translate-x-[-50%] translate-y-[-50%]  ">
        <ul className="flex items-center justify-center gap-8">
          <Link href={"#"}>Pricing</Link>
          <Link href={"#"}>About</Link>
          <Link href={"#"}>Documentation</Link>
          <Link href={"#"}>Features</Link>
        </ul>
      </nav>
      <aside className=" flex gap-2 items-center">
        <SignedOut>
          <Link
            href={"/sign-in"}
            className="bg-primary text-white p-2 px-4 rounded-md hover:bg-primary/80"
          >
            Login
          </Link>
        </SignedOut>
        <UserButton />

        <ModeToggle />
      </aside>
    </div>
  );
};

export default Navigation;
