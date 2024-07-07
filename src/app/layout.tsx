import "@/styles/globals.css";
import type { Metadata } from "next";

import { GeistSans } from "geist/font/sans";
import { TRPCReactProvider } from "@/trpc/react";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";

import { Toaster } from "@/components/ui/sonner";
import { ModeToggle } from "@/components/theme-toggle";

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
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <ClerkProvider>
        <body>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <TRPCReactProvider>
              <main className="flex h-screen flex-col items-center justify-center">
                <div className="h-full w-3/4 overflow-y-scroll border-x-4 md:w-[60%]">
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
