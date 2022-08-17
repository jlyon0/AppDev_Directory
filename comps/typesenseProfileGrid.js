
import { Grid} from "@mui/material";
import ProfileCard from "./profileCard";

export default function TypesenseProfileGrid({users}) {
    
    if(users==null)
      return;
    else {
        return(
            <Grid container direction="column" spacing={2} padding={2}>
                {users.map((user) => (
                    <Grid item key={user.document.emplid} >
                        <ProfileCard userData={user.document}/>
                    </Grid>
                ))}
            </Grid>
        )
    }
}
