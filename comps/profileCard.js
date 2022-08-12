import { Grid, Box, Typography, Link, Button } from '@mui/material';
import { Card, CardActions, CardActionArea, CardContent, CardMedia } from '@mui/material'
import { useState, useEffect } from "react";

export default function ProfileCard({user}) {
    const [isLoading, setLoading] = useState(false);
    const [profile, setProfile] = useState(null);

    const requestProfile = `${process.env.apiUrl}profiles/${user.emplid}`

    useEffect( ()=> {
        setLoading(true);
        fetch(requestProfile)
            .then((res) => res.json())
            .then((profile) => {
                setProfile(profile);
            });
        setLoading(false);
    },[]);

    if (isLoading) return( <p>Loading...</p> );
    if (!profile) return <p>No data</p>
    let tempBio = profile.bio;
    if( profile.bio.length > 150) {
        tempBio = profile.bio.substring(0,150) + "...";
    }
    return (
        <Card p={3} height='225px' sx={{ width: '100%', height: '225px', display: 'flex' }}>
            <Box sx={{ width: '55%', height: '150', display: 'flex', flexDirection: 'column'}} >
                <CardActionArea>
                    <CardContent height='200px'>
                        <Typography gutterBottom variant="h5" component="div">
                            {user.firstname} {user.lastname}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Email: {profile['email']}   <br/>
                            Phone: {profile['phone']} <br/>
                            Location: {profile.location} <br/>
                        </Typography>    
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    <Grid container justifyContent='center' alignContent='flex-end'>
                        <Grid item>
                            <Link href={`profile/${user.emplid}/view`}>
                                <Button>More</Button>
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href={`profile/${user.emplid}/edit`}>
                                <Button>Edit</Button>
                            </Link>
                            
                        </Grid>
                    </Grid>  
                </CardActions>
            </Box>
            <CardContent justifyContent="center"sx={{ width: '45%', height: '100%' }}>
                <Grid container justifyContent="center">
                    <Grid item id="img">
                        <img src={profile.photo_url} alt="profile photo" height="180" />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}