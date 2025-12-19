import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({token, user}) {
      // Quand l'utilisateur se connecte pour la première fois
      if (user) {
        console.log("Google user reçu:", user)
        token.name = user.name
        token.email = user.email
        token.picture = user.image
      }
      return token
    },
    async session({session, token}) {
      // Copie les infos du token dans la session
      if (session.user) {
        session.user.name = token.name ?? null
        session.user.email = token.email ?? null
        session.user.image = token.picture ?? null
      }
      return session
    },
  }
})

export { handler as GET, handler as POST }
