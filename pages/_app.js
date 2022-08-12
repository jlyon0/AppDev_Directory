import '../styles/globals.css'
import Layout from '../comps/layout'
import { UserProvider } from '@auth0/nextjs-auth0';

function MyApp({ Component, pageProps: { session, ...pageProps} }) {
  return(  
	  <UserProvider>
      		<Layout>
        		<Component {...pageProps} />
      		</Layout>
	  </UserProvider>
  )
}


export default MyApp
