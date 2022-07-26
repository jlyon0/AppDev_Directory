import { useEffect, useState } from "react";
import ProfileCard from "../comps/profileCard";
import { useUser } from '@auth0/nextjs-auth0';

export default function EditProfile() {
    const [userInfo, setUserInfo] = useState(null);
    const { user, error, isLoading } = useUser();
    const [loading, setLoading] = useState(false);

    //console.log("emplnum: ", emplnum);
    const getUser = async() => {
	setLoading(true);
        const emplnum = user['https:\/\/my.butler.edu\/app_metadata'].employeenumber
	fetch(`${process.env.apiUrl}/users/${user['https://my.butler.edu/app_metadata'].employeenumber}`)
            .then((res) => res.json())
            .then((userData) => {
                console.log("fetched",userData);
		setUserInfo(userData);
            });
        console.log(userInfo);
	setLoading(false);
    }
    if(loading)
	return(<p>Loading</p>)
    else {
        console.log("User: ", user);
	getUser();
    }
    
    
    if(!user){
        return( <p>Not good</p>)
    }
	getUser;
    console.log("sending user", userInfo);
    return (
        <ProfileCard user={userInfo[0]}/>
    )
}

