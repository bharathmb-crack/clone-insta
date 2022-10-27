import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId:"498508007741-0umr818i6rg9i806s863jjo2nfliciqe.apps.googleusercontent.com",
      clientSecret: "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",
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async session({ session, token, user }) {
      session.user.username = session.user.name
        .split(" ")
        .join("")
        .toLowerCase();
      session.user.uid = token.sub;
      return session;
    },
  },
};
export default NextAuth(authOptions);
