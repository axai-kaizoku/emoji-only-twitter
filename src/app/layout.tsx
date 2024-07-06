import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";

import { TRPCReactProvider } from "@/trpc/react";

import { ThemeProvider } from "@/components/theme-provider";

import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/Header";

export const metadata = {
  title: "Emoji Only Twitter",
  description: "Twitter but only with emojis",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

import { Toaster } from "@/components/ui/sonner";

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
              <Header />
              <main className="flex h-screen flex-col items-center justify-center">
                <div className="h-full w-11/12 border-x md:w-3/4 ">
                  {children}
                </div>
              </main>
              <Toaster />
            </TRPCReactProvider>
          </ThemeProvider>
        </body>
      </ClerkProvider>
    </html>
  );
}
