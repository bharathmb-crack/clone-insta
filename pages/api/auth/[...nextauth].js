import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId:`${process.env.NEXT_PUBLIC_GOOGLE_ID}`,
      clientSecret: `${process.env.NEXT_PUBLIC_GOOGLE_ID}`,
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
