import { useUser } from "@auth0/nextjs-auth0";
import { Button, Link } from "@mui/material";
import { useState } from "react";


export default function BtnEdit({ userData }) {
    const [editVisibility, setEditVisibility] = useState("visible");
    const { user, error, isLoading } = useUser();
    // Initial checks
    if(!user)
        return;
    
    

    return (
        <div>
            <Link href={`profile/${userData.emplid}/edit`} >
                <Button sx={{ visibility: editVisibility }}>Edit</Button>
            </Link>
        </div>
    )
}