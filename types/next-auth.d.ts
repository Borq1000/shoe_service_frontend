import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken: string;
    error?: "RefreshAccessTokenError";
    user: {
      email: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    accessToken: string;
    refreshToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    email: string;
    accessToken: string;
    refreshToken: string;
    error?: "RefreshAccessTokenError";
  }
}
