import { useEffect, useState } from "react";
import ProfileCard from "../comps/profileCard";
import { useUser, getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';


export default function EditProfile({ userData, session }) {
    const [userInfo, setUserInfo] = useState(null);
    const { user, error, isLoading } = useUser();
    
    if(isLoading) return <div>Loading...</div>;
    if(error) return <div>{error.message}</div>;
    

    if(user) {
        const emplnum = user['https://my.butler.edu/app_metadata'].employeenumber
    	const requestUser = `${process.env.apiUrl}users/${emplnum}`

	if(userData.detail)
	    return( <div> 
		    	<p>We have no record of your user. Please contact HR.</p>
		    </div>
	    );

	return (
		<ProfileCard user={userData}/>
        );
    }else {
	return(<p>Loading...</p>);
    }
}

export const getServerSideProps = withPageAuthRequired({
	returnTo: '/',
	async getServerSideProps(ctx) {
		const session = getSession(ctx.req, ctx.res);
		
		const emplid = session.user['https://my.butler.edu/app_metadata'].employeenumber
		const url = `${process.env.apiUrl}users/${emplid}`
		const res = await fetch(url)
		const json = await res.json();

		const userData = json;

		return {
			props: {
				userData: userData,
			},
		};
	}
});
