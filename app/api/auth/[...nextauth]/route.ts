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
    },
    async jwt({ token , account, profile }) {
      if(account){
        const user = await prisma.user.findUnique({
          where: {
            email: profile?.email
          }
        })
        if(!user){
          throw new Error("No user found")
        }
        token.id = user.id
        token.tenant = {
          id: user.tenantId
        }
      }
      return token
    },
  },
})

export { handler as GET, handler as POST }