import prisma from "@/lib/prisma"
import NextAuth from "next-auth"
import GoogleProvider from 'next-auth/providers/google'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
    })
  ],
  callbacks: {
    async signIn({ profile }){
      if(!profile?.email){
        throw new Error('No profile')
      }
      else{
        const user = await prisma.user.upsert({
          where: {
            email: profile.email
          },
          create: {
            email: profile.email,
            name: profile.name,
            avatar: profile.image,
            tenant: {
              create: {}
            }
          },
          update: {
            name: profile.name,
            avatar: profile.image
          }
        })
        return true
      }
    }
  }
})

export { handler as GET, handler as POST }