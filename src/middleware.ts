import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

console.log("middleware called");

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
