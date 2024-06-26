import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ModeToggle } from "./theme-toggle";

export default function Header() {
  return (
    <div className=" flex w-full items-center justify-between border-b px-4 py-4  lg:px-40 ">
      <div className="text-xl font-bold md:text-3xl">Emoji Only Twitter</div>
      <div className="flex gap-4">
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <ModeToggle />
      </div>
    </div>
  );
}
