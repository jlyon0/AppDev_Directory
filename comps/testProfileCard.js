
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Box from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useState, useEffect } from "react";
import EditProfile from './editProfileButton';
import ProfileGrid from './profileGrid';
// import EditProfile from './editProfile';

export default function TestProfileCard({user}) {
    const [isLoading, setLoading] = useState(false);
    const [profile, setProfile] = useState(null);

    

    const requestProfile = `${process.env.apiUrl}/profiles/${user.emplid}`
    //may need to use useEffect()
    //need to useEffect() if we use await
    useEffect( ()=> {
        fetch(requestProfile)
            .then((res) => res.json())
            .then((profile) => {
                setProfile(profile);
            });
    },[]);
    const img_url = "http://localhost:9002/directory/"+user.username+"-photo.jpg"

    if (isLoading) return( <p>Loading...</p> );
    if (!profile) return <p>No data</p>

    return (
        <Card p={1} sx={{ width: '100%', height: '225px', display: 'flex' }}>
            <Box sx={{ width: '55%', height: '150', display: 'flex', flexDirection: 'column'}} >
                <CardActionArea>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {user.firstname} {user.lastname}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Email: {profile['email']}   <br/>
                            Phone: {profile['phone']} <br/>
                            Location: {profile.location} <br/>
                            Office Hours: {profile.office_hours} <br/>
                            Bio: {profile.bio} <br/>
                            
                            
                        </Typography>    
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    <Grid container justifyContent='center'>
                        <Grid item>
                            <Button size="small">More</Button>
                        </Grid>


                        <Grid item>
                            <EditProfile user={user} profile={profile}/>
                        </Grid>


                    </Grid>  
                </CardActions>
            </Box>
            <CardContent sx={{ width: '45%', height: '100%' }}>
                
              <CardMedia  
                component="img"
                
                sx={{ width: '100%', height: '100%' }}
                
                image={profile.photo_url}
                alt="No Profile Pic"
                />  
            </CardContent>
        </Card>
    )
}