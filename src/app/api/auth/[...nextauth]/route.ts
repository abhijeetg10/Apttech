import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    })
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;
      
      const dbUser = await prisma.user.findUnique({
        where: { email: user.email }
      });
      
      // Auto-provision master admin
      if (!dbUser && user.email === 'apttechtest.in@gmail.com') {
        await prisma.user.create({
          data: {
            email: user.email,
            name: user.name || "Apttech Admin",
            role: "ADMIN"
          }
        });
        return true;
      }
      
      // Only allow login if the email exists in our database
      if (dbUser) {
        return true;
      }
      
      return false; // Deny access
    },
    async jwt({ token, user }) {
      if (user && user.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          include: { batch: true }
        });
        
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.batchId = dbUser.batchId;
          token.batchName = dbUser.batch?.name;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).id = token.id || token.sub;
        (session.user as any).role = token.role;
        (session.user as any).batchId = token.batchId;
        (session.user as any).batchName = token.batchName;
      }
      return session;
    }
  },
  pages: {
    signIn: "/", // We will redirect to / if they are unauthenticated
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development"
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
