import "@/styles/globals.css";
import type { Metadata } from "next";

import { headers } from "next/headers";
import { GeistSans } from "geist/font/sans";
import { TRPCReactProvider } from "@/trpc/react";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

import { Toaster } from "@/components/ui/sonner";
import { ModeToggle } from "@/components/theme-toggle";
import { GithubIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Emoji Only Twitter",
  description: "Twitter but only with emojis",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = headers();
  const headerUrl = headersList.get("x-url") ?? "";
  // const isHome = headerUrl
  console.log(headerUrl, "url");
  return (
    <html lang="en" className={`${GeistSans.className}`}>
      <ClerkProvider>
        <body>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <TRPCReactProvider>
              <main className="relative flex h-screen w-full justify-end sm:justify-center ">
                <div className="fixed left-0 top-0 h-full w-[20%]">
                  <div
                    id="sign-in-button"
                    className="flex h-full w-full flex-col items-center justify-around text-xs sm:text-base"
                  >
                    <span>Emoji only Twitter</span>
                    <span>Made with ❤️</span>
                    <span className="flex items-center gap-2">
                      Support Me <GithubIcon size={18} />
                    </span>
                    <>
                      <SignedOut>
                        <SignInButton />
                      </SignedOut>
                      <SignedIn>
                        <UserButton />
                      </SignedIn>
                    </>
                  </div>
                </div>
                <div className="h-fit min-h-screen w-3/4 border-x-4 md:w-[60%]">
                  {children}
                </div>
              </main>
              <Toaster />
              <ModeToggle />
            </TRPCReactProvider>
          </ThemeProvider>
        </body>
      </ClerkProvider>
    </html>
  );
}

export const TopNavIndicator = ({ isBorder }: { isBorder: boolean }) => {
  return (
    <div
      className={`fixed z-50 flex h-12 w-[calc(75%-0.5rem)] items-center justify-center ${isBorder ? "border-b-4" : "border-none"} backdrop-blur md:w-[calc(60%-0.5rem)]`}
    >
      Emoji only Twitter
    </div>
  );
};
