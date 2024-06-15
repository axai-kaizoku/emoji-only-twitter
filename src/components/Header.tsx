import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ModeToggle } from "./theme-toggle";

export default function Header() {
  return (
    <div className="fixed top-0 flex w-full items-center justify-between border-b px-40 py-4 backdrop-blur-sm backdrop-filter ">
      <div className="text-3xl font-bold">Emoji Only Twitter</div>
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
