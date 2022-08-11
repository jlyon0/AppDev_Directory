import { Box, Button, TextField, Link, Grid, Typography } from '@mui/material';
import React from 'react';
import { useState, useRef } from 'react';
import { useUser, getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router';

export default function EditProfile({userData, profile}) {
    const { user, error, isLoading } = useUser();
     if(!user)
        return;
	
    const router = useRouter()
    
    const emailRef = useRef('');
    const phoneRef = useRef('');
    const locationRef = useRef('');
    const firstRef = useRef('');
    const lastRef = useRef('');
    const bioRef = useRef('');
    const officeHoursRef = useRef('');

    
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // Upload files and file data validation **************************Section
    const [photoSrc, setPhoto] = useState('')
    const [CVSrc, setCV] = useState('')
    const [resumeSrc, setResume] = useState('')
    const [isVisible_Submit, setVisible_Submit] = useState('visible')
    const [photoColor,setPhotoColor] = useState('grey');
    const [CVColor, setCVColor] = useState('grey');
    const [resumeColor,setResumeColor] = useState('grey');
    let imgsrc = "";

    if( `${process.env.minioUrl}${userData.username}-photo.jpg`) {
        // Show profile preview
        var avatarImg = new Image();
        // Set imgsrc *****
        imgsrc = `${process.env.minioUrl}${userData.username}-photo.jpg`
        avatarImg.src = imgsrc;
        avatarImg.onload = function() {
            var c = document.getElementById("myCanvas");
            c.removeAttribute("hidden");
            var ctx = c.getContext("2d");
            ctx.canvas.width = 350;
            ctx.canvas.height = 250;
            
            ctx.drawImage(avatarImg,0,0);
        }
    }

    const handleUploadImage = async (e)=> {
        e.preventDefault();
        
        if(e.target.files && e.target.files[0]) {
            const fileSize = e.target.files[0].size / 1024 / 1024; // in MiB
            const fileName = "";
            fileName = e.target.files[0].name;

            if(fileSize > 2) {
                alert("Error. Photo file size exceeds 2 MiB");

                setPhotoColor('red');
                return;
            }else if( !((fileName.includes(".png")) || (fileName.includes(".jpg"))) ){
                alert("Error. Incorrect file type. Use .png or .jpg file types.")
                setPhotoColor('red');

            }else{
                setPhotoColor('grey');
                if(resumeColor == CVColor == photoColor == "grey")
                    setVisible_Submit('visible');
            }
            var reader = new FileReader();
            setPhoto(reader.result)
            reader.addEventListener(
                "load",
                function() {
                    var avatarImg = new Image();
                    // Set imgsrc *****
                    imgsrc = reader.result;
                    setPhoto(reader.result);
                    avatarImg.src = imgsrc;
                    avatarImg.onload = function() {
                        var c = document.getElementById("myCanvas");
                        c.removeAttribute("hidden");
                        var ctx = c.getContext("2d");
                        ctx.canvas.width = 300;
                        ctx.canvas.height = 180;
                        
                        ctx.drawImage(avatarImg,0,0);
                    };
                },
                false
            );
            reader.readAsDataURL(e.target.files[0]);
        }
    }

    const handleRemovePhoto = () => {
        //remove from minio
        const minioClient = require('../comps/minioClient');
        minioClient.removeObject('directory', `${user.username}-photo.jpg`, function(err) {
            if (err) {
                return console.log("Unable to remove object", err);
            }
        })
        // clear photo preview
        document.getElementById("photoUpload").value = ""
        var c = document.getElementById("myCanvas")
        c.setAttribute("hidden", "hidden")
        var ctx = c.getContext("2d");
        ctx.clearRect(0,0,300,180)

        setPhotoColor('grey')
        if(resumeColor == CVColor && CVColor == photoColor)
            setVisible_Submit('visible');
    }
    

    const handleUploadCV = async (e) => {
        e.preventDefault();

        

        if(e.target.files && e.target.files[0]) {
            const fileSize = e.target.files[0].size / 1024 / 1024; // in MiB
            const fileName = "";
            fileName = e.target.files[0].name;
            if(fileSize > 2) {
                alert("Error. CV file size exceeds 2 MiB");

                setCVColor('red');
                return;
            }else if( !(fileName.includes(".pdf")) ){
                alert("Error. Incorrect file type. Use a .pdf file type.")
                setCVColor('red');

                return;
            }else {
                setCVColor('grey');
                if(resumeColor == CVColor && CVColor == photoColor)
                    setVisible_Submit('visible');
            }

            var reader = new FileReader();
            reader.addEventListener(
                "load",
                function() {
                    setCV(reader.result);
                },
                false
            );
            reader.readAsDataURL(e.target.files[0]);
        }
    }
    const handleRemoveCV = async () => {
        //remove from minio
        const minioClient = require('../comps/minioClient');
        minioClient.removeObject('directory', `${user.username}-cv.jpg`, function(err) {
            if (err) {
                return console.log("Unable to remove object", err);
            }
        })
        document.getElementById("cvUpload").value = "";
        setCVColor('grey')
        if(resumeColor == CVColor && CVColor == photoColor)
            setVisible_Submit('visible');
    }

    const handleUploadResume = async (e) => {
        e.preventDefault();

        

        if(e.target.files && e.target.files[0]) {
            const fileSize = e.target.files[0].size / 1024 / 1024; // in MiB
            const fileName = "";
            fileName = e.target.files[0].name;
            if(fileSize > 2) {
                alert("Error. CV file size exceeds 2 MiB");
                setCVColor('red');
                return;
            }else if( !(fileName.includes(".pdf")) ){
                alert("Error. Incorrect file type. Use a .pdf file type.")
                setCVColor('red');
                return;
            }else {
                setResumeColor('grey');
                if(resumeColor == CVColor == photoColor == "grey")
                    setVisible_Submit('visible');
            }
            
            var reader = new FileReader();
            reader.addEventListener(
                "load",
                function() {
                    setResume(reader.result);
                },
                false
            );
            reader.readAsDataURL(e.target.files[0]);
        }
    }
    const handleRemoveResume = () => {
        //remove from minio
        const minioClient = require('../comps/minioClient');
        minioClient.removeObject('directory', `${user.username}-resume.jpg`, function(err) {
            if (err) {
                return console.log("Unable to remove object", err);
            }
        })
        document.getElementById("resumeUpload").value = "";
        setResumeColor('grey')
        if(resumeColor == CVColor && CVColor == photoColor)
            setVisible_Submit('visible');
    }

    // Data Validation for text inputs *************************** Section
    // Handles the submit event on form submit.
    const [emailColor,setEmailColor] = useState('grey');
    const [phoneColor, setPhoneColor] = useState('grey');
    const validateEmail = (element) => {
        // Data Validation
        if(!element.value.includes("@")) {
            setEmailColor("red");
            return;
        }
        else
            setEmailColor("grey");
        return;
    }
    const validatePhone = (element) => {
        // Data Validation
        if(element.value[3] != '-' || element.value[7] != '-' || element.value.includes("a","b",'c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z') || element.value.length != 12) {
            setPhoneColor("red");
            return;
        }else
            setPhoneColor("grey");
        return;
    }

    // Submit **************************** Section

    const handleSubmit = async (event) => {
        // Stop the form from submitting and refreshing the page.
        event.preventDefault(); 
            
        // Get data from the form.
        const profileData = {
            emplid: userData.emplid,
            email: emailRef.current.value,
            phone: phoneRef.current.value,
            bio: bioRef.current.value,
            photo_url: "",
            resume_url: "",
            vitae_url: "",
            office_hours: officeHoursRef.current.value,
            location: locationRef.current.value,
            is_public: true,
            display_personal: true,
            undesirable: true,    
        };
        
        if(!profileData.email.includes("@")){
            alert("Invalid email\nExample: example@email.com")
            return;
        }
        else if(profileData.phone.includes("a","b",'c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z')) {
            alert("Invalid phone\nExample: 123-456-7890");
            return;
        }
        else if( profileData.phone.length != 0 && ( profileData.phone[3] != '-' || profileData.phone[7] != '-' )) {
            alert("Invalid phone\nExample: 123-456-7890");
            return;
        }
        if(photoColor == "red" || CVColor == "red" || resumeColor == "red"){
            alert("File uploads are incorrect. See red boarders.")
            return;
        }
	console.log("photoSrc", photoSrc);

	
    if(photoSrc != ""){
        profileData.photo_url = process.env.minioUrl + userData.username + "-photo.jpg"
    }else{
        if(`${process.env.minioUrl}${userData.username}-photo.jpg`)
            profileData.photo_url = process.env.minioUrl + userData.username + "-photo.jpg"
    }
	if(resumeSrc != ""){
            profileData.resume_url = process.env.minioUrl + userData.username + "-resume.pdf"
	}else{
	    if(`${process.env.minioUrl}${userData.username}-resume.pdf`)
            	profileData.resume_url = process.env.minioUrl + userData.username + "-resume.pdf"
	}
	if(CVSrc != ""){
            profileData.vitae_url = process.env.minioUrl + userData.username + "-cv.pdf"
	}else{
	    if(`${process.env.minioUrl}${userData.username}-cv.pdf`)
            	profileData.vitae_url = process.env.minioUrl + userData.username + "-cv.pdf"
	}

        // Send the data to the server in JSON format.
        const profileDataJSON= JSON.stringify(profileData);

        // API endpoint where we send form data.
        let profilesEndpoint = `${process.env.apiUrl}profiles/${userData.emplid}`;

        // Form the request for sending data to the server.
        const options = {
            // The method is POST because we are sending data.
            method: 'PUT',
            // Tell the server we're sending JSON.
            headers: {
                'Content-Type': 'application/json',
            },
            body: profileDataJSON,
        };
        console.log("PUT profileData:");
        console.log(profileDataJSON);
        const response = await fetch(profilesEndpoint, options);

        // Get the response data from server as JSON
        // IF server returns the name submitted, that means the form works.
        const result = await response.json();
        console.log(`Result:`);
        console.log(result);
	if(result.detail == 'Profile doesn\'t exist'){
        	console.log("results: ", result);
		options.method = "POST";
		profilesEndpoint = `${process.env.apiUrl}profiles`;
		const res = await fetch(profilesEndpoint, options);
		const json = await res.json();
		console.log("results:", json);
	}


	//check to make sure we are not overWriting link with ""
        function exists(string) {
            const minioClient = require('../comps/minioClient');
	    minioClient.statObject("directory",string, function(err, stat) {
	    	if(err) {
	    	    console.log(err)
		    return false;
		}
	   	console.log(stat);
		return true;
	    })
	    return true;
	}

        if(photoSrc != "") {
            //remove old from minio **** if exists not implemented. Don't want to have to search first, but may have to.
            const minioClient = require('../comps/minioClient');
            minioClient.removeObject('directory', `${userData.username}-photo.jpg`, function(err) {
                if (err) {
                    return console.log("Unable to remove object", err);
                }
            })
            
            // Send new photo to minio
            var buffer = new Buffer(photoSrc.split(",")[1], 'base64')
            var photo_name = `${userData.username}-photo.jpg`;
            console.log("Photo buffer: ", buffer)

            minioClient.putObject('directory', photo_name, buffer, function(err, etag) {
                return console.log(err, etag) // err should be null
            })
        }else {
            console.log("No photoSrc")
        }
        if(CVSrc!= "") {
            //remove old from minio **** if exists not implemented. Don't want to have to search first, but may have to.
            const minioClient = require('../comps/minioClient');
            minioClient.removeObject('directory', `${userData.username}-cv.pdf`, function(err) {
                if (err) {
                    return console.log("Unable to remove object", err);
                }
            })
            
            // Send new photo to minio
            var buffer = new Buffer(CVSrc.split(",")[1], 'base64')
            var CV_name = `${user.username}-cv.pdf`;
            console.log("CV buffer: ", buffer )

            minioClient.putObject('directory', CV_name, buffer, function(err, etag) {
                return console.log(err, etag) // err should be null
            })
        }else {
            console.log("No CVSrc")
        }

        if(resumeSrc!= "") {
            //remove old from minio **** if exists not implemented. Don't want to have to search first, but may have to.
            const minioClient = require('../comps/minioClient');
            minioClient.removeObject('directory', `${userData.username}-resume.pdf`, function(err) {
                if (err) {
                    return console.log("Unable to remove object", err);
                }
            })
            
            // Send new photo to minio
            var buffer = new Buffer(resumeSrc.split(",")[1], 'base64')
            var CV_name = `${userData.username}-resume.pdf`;
            console.log("Resume buffer: ", buffer)

            minioClient.putObject('directory', CV_name, buffer, function(err, etag) {
                return console.log(err, etag) // err should be null
            })
        }else {
            console.log("No resumeSrc")
        }
        

	    router.push("/view-profile");
        
    };

    return(
        <div>
       	    <Box sx={{ direction: 'column', m: 3, width: '90%', alignItems: 'center', justifyContent: 'center'}}>            
                    <Typography variant="h4">{userData['firstname']} {userData['lastname']}</Typography>
                    <br/>
                    <Grid container direction="row">
                        <Grid item id={1}>
                            
                            <Grid container direction="column">
                                <Grid item id="email">
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="outlined-name"
                                        label="Email Address"
                                        inputRef={emailRef}
                                        type="email"
                                        variant="outlined"
                                        defaultValue={profile['email']}
                                        onChange={e => validateEmail(e.target)}
                                        sx={{"& .MuiOutlinedInput-root": {
                                            "& > fieldset": { borderColor: emailColor },
                                        }
                                        }}
                                    />
                                </Grid>
                                <Grid item id="phone">
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="outlined-name"
                                        label="Phone"
                                        inputRef={phoneRef}
                                        type="tel"
                                        variant="outlined"
                                        defaultValue={profile['phone']}
                                        onChange={e => validatePhone(e.target)}
                                        sx={{"& .MuiOutlinedInput-root": {
                                            "& > fieldset": { borderColor: phoneColor },
                                        }
                                        }}
                                    />
                                </Grid>
                                <Grid item id="location">
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="outlined-name"
                                        label="Location"
                                        inputRef={locationRef}
                                        type="text"
                                        variant="outlined"
                                        defaultValue={profile['location']}
                                    />
                                </Grid>
                            </Grid>

                        </Grid>
                        <Grid item id="photo" sx={{ justifyContent: 'flex-end' }}>
                            <Box >
                                <canvas hidden id="myCanvas" ></canvas>
                            </Box>
                            
                        </Grid>
                        
                    </Grid>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="outlined-name"
                        label="Office Hours"
                        inputRef={officeHoursRef}
                        type="text"
                        variant="outlined"
                        defaultValue={profile['office_hours']}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="outlined-name"
                        label="Bio"
                        inputRef={bioRef}
                        type="text"
                        fullWidth
                        variant="outlined"
                        defaultValue={profile['bio']}
                    />
                    
                    <TextField
                        autoFocus
                        margin="dense"
                        id="photoUpload"
                        label="Image Upload"
                        name="upload-photo"
                        type="file"
                        accept=".png,.jpg"
                        // fullWidth
                        InputLabelProps={{shrink: true,}}
                        variant="outlined"
                        onChange={ handleUploadImage }
                        sx={{"& .MuiOutlinedInput-root": {
                            "& > fieldset": { borderColor: photoColor },
                          }
                        }}
                    />
                    <Button onClick={handleRemovePhoto} >Remove Photo</Button>
                    
                    <br/>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="cvUpload"
                        label="CV Upload"
                        name="cv"
                        type="file"
                        accept=".pdf"
                        // fullWidth
                        InputLabelProps={{shrink: true,}}
                        variant="outlined"
                        onChange={ handleUploadCV }
                        sx={{"& .MuiOutlinedInput-root": {
                            "& > fieldset": { borderColor: CVColor },
                          }
                        }}
                    />
                    <Button onClick={handleRemoveCV} >Remove CV</Button>
                    <br/>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="resumeUpload"
                        label="Resume Upload"
                        name="resume"
                        type="file"
                        accept=".pdf"
                        // fullWidth
                        InputLabelProps={{shrink: true,}}
                        variant="outlined"
                        onChange={ handleUploadResume }
                        sx={{"& .MuiOutlinedInput-root": {
                            "& > fieldset": { borderColor: resumeColor },
                          }
                        }}
                    />
                    <Button onClick={handleRemoveResume} >Remove Resume</Button>
                    
                    
               	    <br/> 
                    <Button onClick={handleClose}>Cancel</Button>
                   <Button onClick={handleSubmit}sx={{ visibility: isVisible_Submit}}>Submit</Button>
	    </Box>
        </div>
    )
}
export const getServerSideProps = withPageAuthRequired({
	returnTo: '/',
	async getServerSideProps(ctx) {
		const session = getSession(ctx.req, ctx.res);
		
		const emplid = session.user['https://my.butler.edu/app_metadata'].employeenumber
		let url = process.env.apiUrl +"users/" +emplid
		let res = await fetch(url)
		let json = await res.json();

		const userData = json;
	// correct one is commented out 
        // url = `${process.env.apiUrl}/profiles/${emplid}`
        url = `${process.env.apiUrl}profiles/${emplid}`
        res = await fetch(url)
        json = await res.json();

        const profile = json;
		return {
			props: {
				userData: userData,
                profile: profile,
			},
		};
	}
});