import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import TestProfileCard from "../comps/testProfileCard";



export default function EditProfile() {
    const { data: session } = useSession()
    const [user, setUser] = useState([
        {
          id: "temp"
        }
      ])
    if(!session){
        return (<p>You are not logged in. Go elsewhere</p>)
    }
    
    const name = "joe"; 
    
    useEffect( ()=> {
        fetch(`${process.env.apiUrl}/search?terms=${name}&skip=0&limit=1`)
            .then((res) => res.json())
            .then((userData) => {
                setUser(userData);
            });
    },[]);

    if(user[0].id)
        return( <p>Not good</p>)
    
    return (
        <TestProfileCard user={user}/>
    )
}

