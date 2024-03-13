import { getServerSession } from 'next-auth/next'

export const session = async ({ session, token }: any) => {
    session.user.id = token.id
    session.user.tenant = token.tenant
    return session
}

export const getUserSession = async() => {
    const authSession = await getServerSession({
        callbacks: {
            session
        }
    })
    if(!authSession){
        throw new Error('unauthorized')
    }
    return authSession.user
}