import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import Auth0Provider from "next-auth/providers/auth0"

export default async function auth(req,res) {
	const  providers= [
	        //GithubProvider({
		//        clientId: process.env.GitHub_ID,
		//        clientSecret: process.env.GitHub_Secret,
		//}),
		Auth0Provider({
			clientId: process.env.Auth0_ID,
			clientSecret: process.env.Auth0_Secret,
			issuer: process.env.Auth0_Issuer,
		})
	]
	return await NextAuth(req, res, {
		providers,
	})
}
