import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'

export default NextAuth({
    providers: [
        GithubProvider({
            clientId: process.env.GitHub_ID,
            clientSecret: process.env.GitHub_Secret,
        }),
    ],
})