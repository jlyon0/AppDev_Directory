import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import React from 'react';
import { useState, useRef } from 'react';
import { useUser } from '@auth0/nextjs-auth0';

export default function EditProfile({userData, profile}) {
    const { user, error, isLoading } = useUser();
     if(!user)
        return;

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
                    console.log("imgsrc: ", imgsrc)
                    console.log("photoSrc: ", photoSrc)
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
        const minioClient = require('./minioClient');
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
        const minioClient = require('./minioClient');
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
        const minioClient = require('./minioClient');
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

        if(photoSrc != "")
            profileData.photo_url = "https://docker-dev.butler.edu:9002/directory/"+userData.username+"-photo.jpg"
        if(resumeSrc != "")
            profileData.resume_url = "https://localhost:9002/directory/"+userData.username+"-resume.pdf"
        if(CVSrc != "")
            profileData.vitae_url = "https://localhost:9002/directory/"+userData.username+"-cv.pdf"

        // Send the data to the server in JSON format.
        const profileDataJSON= JSON.stringify(profileData);

        // API endpoint where we send form data.
        const profilesEndpoint = `${process.env.apiUrl}/profiles/${userData.emplid}`;

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
        console.log("results: ", result);


        if(photoSrc != "") {
            //remove old from minio **** if exists not implemented. Don't want to have to search first, but may have to.
            const minioClient = require('./minioClient');
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
            const minioClient = require('./minioClient');
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
            const minioClient = require('./minioClient');
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
        

        // alert(`Result: ${result}`);
        setOpen(false);
        
        
        
    };

    return(
        <div>
            <Button size="small" onClick={handleClickOpen}>Edit</Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    
                </DialogContentText>
                    
                    <TextField
                        autoFocus
                        margin="dense"
                        id="outlined-name"
                        label="Preferred First Name"
                        inputRef={firstRef}
                        type="text"
                        fullWidth
                        variant="outlined"
                        defaultValue={userData['firstname']}
                    ></TextField>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="outlined-name"
                        label="Preferred Last Name"
                        inputRef={lastRef}
                        type="text"
                        fullWidth
                        variant="outlined"
                        defaultValue={userData['lastname']}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="outlined-name"
                        label="Email Address"
                        inputRef={emailRef}
                        type="email"
                        fullWidth
                        variant="outlined"
                        defaultValue={profile['email']}
                        onChange={e => validateEmail(e.target)}
                        sx={{"& .MuiOutlinedInput-root": {
                            "& > fieldset": { borderColor: emailColor },
                          }
                        }}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="outlined-name"
                        label="Phone"
                        inputRef={phoneRef}
                        type="tel"
                        fullWidth
                        variant="outlined"
                        defaultValue={profile['phone']}
                        onChange={e => validatePhone(e.target)}
                        sx={{"& .MuiOutlinedInput-root": {
                            "& > fieldset": { borderColor: phoneColor },
                          }
                        }}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="outlined-name"
                        label="Location"
                        inputRef={locationRef}
                        type="text"
                        fullWidth
                        variant="outlined"
                        defaultValue={profile['location']}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="outlined-name"
                        label="Office Hours"
                        inputRef={officeHoursRef}
                        type="text"
                        fullWidth
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
                    <canvas hidden id="myCanvas" ></canvas>
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
                    
                    
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit} sx={{ visibility: isVisible_Submit}}>Submit</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
