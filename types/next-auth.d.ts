import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      preferredLanguage: "en" | "fa";
      timezone: string;
      theme: "SYSTEM" | "LIGHT" | "DARK";
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    preferredLanguage: "en" | "fa";
    timezone: string;
    theme: "SYSTEM" | "LIGHT" | "DARK";
  }
}

