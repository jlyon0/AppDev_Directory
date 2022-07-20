import { useEffect, useState } from "react";
import ProfileCard from "../comps/profileCard";

export default function EditProfile() {
    const [user, setUser] = useState(null);
    
    const name = "joe"; 

    useEffect( ()=> {
        fetch(`${process.env.apiUrl}/search?terms=joe&skip=0&limit=1`)
            .then((res) => res.json())
            .then((userData) => {
                setUser(userData[0]);
            });
    },[]);
    
    if(!user){
        return( <p>Not good</p>)
    }
    
    return (
        <ProfileCard user={user}/>
    )
}

