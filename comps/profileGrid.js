import { Grid} from "@mui/material";
import TestProfileCard from "./testProfileCard";

export default function ProfileGrid({users}) {
    
    if(users[0].id == "temp")
      return (<p>Please search something</p>);
    else {
        return(
            <Grid container direction="column" columnSpacing={3}>
                {users.map((user) => (
                    <Grid item key={user.emplid} >
                    <TestProfileCard user={user}/>
                    </Grid>
                ))}
            </Grid>
        )
    }
      
}