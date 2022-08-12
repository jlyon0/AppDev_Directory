import {useRouter} from 'next/router'
import { Box, Button, TextField, Link, Grid, Typography } from '@mui/material';
import React from 'react';
import { useState, useRef } from 'react';
import { useUser, getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import Image from 'next/image';


const Profile = ({ userData }) => {
    const router = useRouter()
    const { id } = router.query
    const { user, error, isLoading } = useUser();
    // Initial checks
    if(!user)
        return;

    if(!userData.emplid)
        return <p>404 This page does not exist.</p>

    // Input References
    const emailRef = useRef('');
    const phoneRef = useRef('');
    const locationRef = useRef('');
    const bioRef = useRef('');
    const officeHoursRef = useRef('');
    const mondayRef = useRef('');
    const tuesdayRef = useRef('');
    const wednesdayRef = useRef('');
    const thursdayRef = useRef('');
    const fridayRef = useRef('');

    // State hooks
    const [emailColor,setEmailColor] = useState('grey');
    const [phoneColor, setPhoneColor] = useState('grey');
    const [photoSrc, setPhoto] = useState(`${process.env.minioUrl}${userData.username}-photo.jpg`);
    const [rmPhoto, setrmPhoto] = useState(false);
    const [uploadedPhoto, setUploadedPhoto] = useState(false);
    const [CVSrc, setCV] = useState(`${process.env.minioUrl}${userData.username}-cv.pdf`);
    const [rmCV, setrmCV] = useState(false);
    const [uploadedCV, setUploadedCV] = useState(false);
    const [resumeSrc, setResume] = useState(`${process.env.minioUrl}${userData.username}-resume.pdf`);
    const [rmResume, setrmResume] = useState(false);
    const [uploadedResume, setUploadedResume] = useState(false);
    const [isVisible_Submit, setVisible_Submit] = useState('visible');
    const [photoColor,setPhotoColor] = useState('grey');
    const [CVColor, setCVColor] = useState('grey');
    const [resumeColor,setResumeColor] = useState('grey');
    const [isLoaded, setLoaded] = useState(true);

    const officeHours = JSON.parse(userData.profile.office_hours);
    const handleOH = () => {
        officeHours.Monday = mondayRef.current.value;
        officeHours.Tuesday = tuesdayRef.current.value;
        officeHours.Wednesday = wednesdayRef.current.value;
        officeHours.Thursday = thursdayRef.current.value;
        officeHours.Friday = thursdayRef.current.value;
    }
    let imgsrc = "";
    
    const validateEmail = (element) => {
        if(!element.value.includes("@")) {
            setEmailColor("red");
            return;
        }
        else
            setEmailColor("grey");
        return;
    }
    const validatePhone = (element) => {
        if(element.value[3] != '-' || element.value[7] != '-' || element.value.includes("a","b",'c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z') || element.value.length != 12) {
            setPhoneColor("red");
            return;
        }else
            setPhoneColor("grey");
            
        if(element.value.length == 0)
            setPhoneColor("grey");
        return;
        
    }
    
    const handleUploadPhoto = (e) => {
        if(e.target.files && e.target.files[0]) {
            const fileSize = e.target.files[0].size / 1024 / 1024; // in MiB
            const fileName = "";
            fileName = e.target.files[0].name;
            if(fileSize > 2) {
                alert("Error. Photo file size exceeds 2 MiB");
            }else if( !((fileName.includes(".png")) || (fileName.includes(".jpg"))) ){
                alert("Error. Incorrect file type. Use .png or .jpg file types.")
            }else{ 
                var reader = new FileReader();
                reader.addEventListener(
                    "load",
                    function() {
                        setPhoto(reader.result);
                    },
                    false
                );
                reader.readAsDataURL(e.target.files[0]);
                setrmPhoto(false);
                setUploadedPhoto(true);
            }
        } 
    }
    const handleRemovePhoto = () => {
        setPhoto(`${process.env.minioUrl}${userData.username}-photo-that-does-not-exist.jpg`)
        setrmPhoto(true);
        setUploadedPhoto(false);
    }
    const handleUploadResume = (e) => {
        if(e.target.files && e.target.files[0]) {
            const fileSize = e.target.files[0].size / 1024 / 1024; // in MiB
            const fileName = "";
            fileName = e.target.files[0].name;
            if(fileSize > 2) {
                alert("Error. Photo file size exceeds 2 MiB");
            }else if( !(fileName.includes(".pdf")) ){
                alert("Error. Incorrect file type. Use .pdf file types.")
            }else{ 
                var reader = new FileReader();
                reader.addEventListener(
                    "load",
                    function() {
                        setResume(reader.result);
                    },
                    false
                );
                reader.readAsDataURL(e.target.files[0]);
                setrmResume(false);
                setUploadedResume(true);
            }
        }
    }
    const handleRemoveResume = () => {
        setResume(`${process.env.minioUrl}${userData.username}-does-not-exist.pdf`)
        setrmResume(true);
        setUploadedResume(false);
    }
    const handleUploadCV = (e) => {
        if(e.target.files && e.target.files[0]) {
            const fileSize = e.target.files[0].size / 1024 / 1024; // in MiB
            const fileName = "";
            fileName = e.target.files[0].name;
            if(fileSize > 2) {
                alert("Error. Photo file size exceeds 2 MiB");
            }else if( !(fileName.includes(".pdf")) ){
                alert("Error. Incorrect file type. Use .pdf file types.")
            }else{ 
                var reader = new FileReader();
                reader.addEventListener(
                    "load",
                    function() {
                        setCV(reader.result);
                    },
                    false
                );
                reader.readAsDataURL(e.target.files[0]);
                setrmCV(false);
                setUploadedCV(true);
            }
        }
    }
    const handleRemoveCV = () => {
        setCV(`${process.env.minioUrl}${userData.username}-does-not-exist.pdf`)
        setrmCV(true);
        setUploadedCV(false);
    }
    
    const handleSubmit = async (event) => {
        const profileData = {
            emplid: userData.emplid,
            email: emailRef.current.value,
            phone: phoneRef.current.value,
            bio: bioRef.current.value,
            photo_url: `${process.env.minioUrl}/${userData.username}-photo.jpg`,
            resume_url: "",
            vitae_url: "",
            office_hours: JSON.stringify(officeHours),
            location: locationRef.current.value,
            is_public: true,
            display_personal: true,
            undesirable: true,    
        };
        if(bioRef.current.value == null)
            profileData.bio = "";

        const minioClient = require('../../../comps/minioClient');
        if(rmPhoto){
            minioClient.removeObject('directory', `${userData.username}-photo.jpg`, function(err) {
                if (err) {
                    return console.log("Unable to remove object", err);
                }
            })
        }else{
            if(uploadedPhoto){
                var buffer = new Buffer(photoSrc.split(",")[1], 'base64')
                var photo_name = `${userData.username}-photo.jpg`;
                minioClient.putObject('directory', photo_name, buffer, function(err, etag) {
                    return console.log(err, etag) // err should be null
                });
            }
        }
        if(rmResume){
            minioClient.removeObject('directory', `${userData.username}-resume.pdf`, function(err) {
                if (err) {
                    return console.log("Unable to remove object", err);
                }
            })
        }else{
            if(uploadedResume){
                var buffer = new Buffer(resumeSrc.split(",")[1], 'base64')
                var file_name = `${userData.username}-resume.pdf`;
                minioClient.putObject('directory', file_name, buffer, function(err, etag) {
                    return console.log(err, etag) // err should be null
                });
            }
        }
        if(rmCV){
            minioClient.removeObject('directory', `${userData.username}-cv.pdf`, function(err) {
                if (err) {
                    return console.log("Unable to remove object", err);
                }
            })
        }else{
            if(uploadedCV){
                var buffer = new Buffer(CVSrc.split(",")[1], 'base64')
                var file_name = `${userData.username}-cv.pdf`;
                minioClient.putObject('directory', file_name, buffer, function(err, etag) {
                    return console.log(err, etag) // err should be null
                });
            }
        }

        const profileDataJSON = JSON.stringify(profileData);
        let profilesEndpoint = `${process.env.apiUrl}profiles/${userData.emplid}`;
        const options = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
            body: profileDataJSON,
        };

        const response = await fetch(profilesEndpoint, options);
        const result = await response.json();

        router.push(`/profile/${userData.emplid}/view`);
    }
    return (
        <div>
            <Box sx={{ p: 1, m:1, borderRadius: 2}}>
                    <Grid container id="window" direction="row" justifyContent="space-evenly">
                        <Grid item id={1}>
                            <Typography variant="h4">{userData['firstname']} {userData['lastname']}</Typography>
                            <br/>
                            <Grid container id="contact-info" direction="column">
                                <h3>Contact Information</h3>
                                <Grid item id="email">
                                    <TextField
                                        autoFocus margin="dense" id="outlined-name" label="Email Address" 
                                        inputRef={emailRef} type="email" variant="outlined" 
                                        defaultValue={userData.profile['email']} 
                                        onChange={e => validateEmail(e.target)}
                                        sx={{"& .MuiOutlinedInput-root": {
                                            "& > fieldset": { borderColor: emailColor },
                                        }
                                        }}
                                    />
                                </Grid>
                                <Grid item id="phone">
                                    <TextField
                                        autoFocus margin="dense" id="outlined-name" label="Phone" 
                                        inputRef={phoneRef} type="tel" variant="outlined" 
                                        defaultValue={userData.profile['phone']}
                                        onChange={e => validatePhone(e.target)}
                                        sx={{"& .MuiOutlinedInput-root": {
                                            "& > fieldset": { borderColor: phoneColor },
                                        }
                                        }}
                                    />
                                </Grid>
                                <Grid item id="location">
                                    <TextField
                                        autoFocus margin="dense" id="outlined-name" label="Location" 
                                        inputRef={locationRef} type="text" variant="outlined"
                                        defaultValue={userData.profile['location']}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item id="Bio">
                            <br/><br/>
                            <h3><u>Biography</u></h3>
                            <TextField
                                autoFocus margin="dense" id="outlined-name" label="Bio" fullWidth
                                inputRef={bioRef} type="text" variant="outlined" multiline
                                defaultValue={userData.profile['bio']} rows={8}
                                sx={{ width: '500px', height: '400px'}}
                            />
                        </Grid>
                        <Grid item id="photo-items" justify='right'>
                            <Grid container id="photo-items" direction='column'  justifyContent="space-evenly">
                                <Grid item id="photo">
                                    <Image src={photoSrc} id='photo' alt="profile photo" width="300" height="300" ></Image>
                                </Grid>
                                <Grid item id="photo-btns">
                                     <Button variant="contained" component="label">
                                        Upload Photo
                                        <TextField
                                        autoFocus
                                        margin='none'
                                        size='small'
                                        id="photoUpload"
                                        name="upload-photo"
                                        type="file"
                                        accept=".png,.jpg"
                                        onChange={ handleUploadPhoto }
                                        sx={{ visibility: 'hidden', width: '0px', height: '0px'}}
                                        />
                                    </Button>
                                    <Button variant="contained" onClick={handleRemovePhoto} >Remove Photo</Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
            </Box>
            <Box sx={{ p: 1, m:1, borderRadius: 2}}>
                <Grid container direction="row" spacing={1} justifyContent="space-evenly">
                    <Grid item id="officeHours">
                        <Grid container id="officeHours" direction="column" >
                            <h3>Office Hours</h3>
                            <Grid item id="MondayOH">
                                <TextField label="Monday" defaultValue={officeHours.Monday} inputRef={mondayRef} onChange={handleOH}/>
                            </Grid>
                            <Grid item id="TuesdayOH">
                                <TextField label="Tuesday" defaultValue={officeHours.Tuesday} inputRef={tuesdayRef} onChange={handleOH}/>
                            </Grid>
                            <Grid item id="WednesdayOH">
                                <TextField label="Wednesday" defaultValue={officeHours.Wednesday} inputRef={wednesdayRef} onChange={handleOH}/>
                            </Grid>
                            <Grid item id="ThursdayOH">
                                <TextField label="Thursday" defaultValue={officeHours.Thursday} inputRef={thursdayRef} onChange={handleOH}/>
                            </Grid>
                            <Grid item id="FridayOH" justifySelf="flex-end">
                                <TextField label="Friday" defaultValue={officeHours.Friday} inputRef={fridayRef} onChange={handleOH}/>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item id="resume" alignSelf="center">
                        <Button variant="contained" component="label">
                            Upload Resume
                            <TextField
                                autoFocus margin="dense" id="resumeUpload" label="Resume Upload"
                                name="resume" type="file" accept=".pdf"
                                InputLabelProps={{shrink: true,}}
                                variant="outlined"
                                onChange={ handleUploadResume }
                                sx={{ visibility: 'hidden', width: '0px', height: '0px'}}
                            />
                        </Button>
                        <Button variant="contained" onClick={handleRemoveResume} >Remove Resume</Button>
                    </Grid>
                    <Grid item id="cv" alignSelf="center">
                        <Button variant="contained" component="label">
                            Upload CV
                            <TextField
                                autoFocus margin="dense" id="resumeCV" label="CV Upload"
                                name="cv" type="file" accept=".pdf"
                                InputLabelProps={{shrink: true,}}
                                variant="outlined"
                                onChange={ handleUploadCV }
                                sx={{ visibility: 'hidden', width: '0px', height: '0px'}}
                            />
                        </Button>
                        <Button variant="contained" onClick={handleRemoveCV} >Remove Resume</Button>
                    </Grid>
                </Grid>
            </Box>
            <Grid justifyContent="center">
                <Button onClick={handleSubmit}sx={{ visibility: isVisible_Submit}}>Save</Button>
                <Link href={`/profiles/${userData.emplid}/view`}>
                    <Button>Cancel</Button>
                </Link>
            </Grid>
        </div>
    );
}

export const getServerSideProps = withPageAuthRequired({
	returnTo: '/',
	async getServerSideProps(ctx) {
		const session = getSession(ctx.req, ctx.res);
		const { id } = ctx.query; 
        const emplid = session.user['https://my.butler.edu/app_metadata'].employeenumber
		let url = process.env.apiUrl +"users/one/" + id + "?include=profile"
		let res = await fetch(url)
		let json = await res.json();
		const userData = json;

		return {
			props: {
				userData: userData,
			},
		};
	}
});

export default Profile