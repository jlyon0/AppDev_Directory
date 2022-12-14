
import { Grid} from "@mui/material";
import ProfileCard from "./profileCard";

export default function ProfileGrid({users}) {
    
    if(users==null)
      return;
    else {
        return(
            <Grid container direction="column" spacing={2} padding={2}>
                {users.map((user) => (
                    <Grid item key={user.emplid} >
                        <ProfileCard userData={user}/>
                    </Grid>
                ))}
            </Grid>
        )
    }
}
