import '../styles/globals.css'
import Layout from '../comps/layout'
import { SessionProvider } from 'next-auth/react'

function MyApp({ Component, pageProps: { session, ...pageProps} }) {

  
  

  return(  
    <SessionProvider seesion={session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  )
}

export default MyApp
