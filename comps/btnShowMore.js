import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import React from 'react';
import { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function ShowMore({user, profile}) {
    const [open, setOpen] = useState(false);
    const [resumeBtn, setResumeBtn] = useState("hidden");
    const [cvBtn, setCVBtn] = useState("hidden")

    // These may be used if we want to preview the PDFs
    // const [resumeSrc, setResumeSrc] = useState();
    // const [cvSrc, setCVSrc] = useState();
    
    function setVisible() {
        if(profile.resume_url) {
            setResumeBtn("visible")
        }
        if(profile.vitae_url != "") {
            setCVBtn("visible")
        }
    }
    const handleClickOpen = () => {
        setVisible()
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button size="small" onClick={handleClickOpen}>More</Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>More Info</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Name:  {user.firstname} {user.lastname} <br/>
                        Email: {profile.email}  <br/>
                        Phone: {profile.phone}  <br/>
                        Location: {profile.location} <br/>
                        Office Hours: {profile.office_hours} <br/>
                        Bio:   {profile.bio}  <br/>
                    </DialogContentText>
                    <div id="resumeButton">
                        <Link href={"http://localhost:9002/directory/jlyon-resume.pdf"}>
                            <Button  sx={{ visibility: resumeBtn}}>View Resume</Button>
                            {/* <Button  sx={{ visibility: "hidden"}}>View Resume</Button> */}
                        </Link>
                    </div>
                    
                    
                    <canvas hidden id="resumeCanvas" ></canvas>
                    <Link href={"http://localhost:9002/directory/jlyon-cv.pdf"}>
                        <Button sx={{ visibility: cvBtn}}>View Vitae</Button>
                        {/* <Button sx={{ visibility: "hidden"}}>View Vitae</Button> */}
                    </Link>
                    
                    <canvas hidden id="CVCanvas" ></canvas>
                </DialogContent>
                  
                    
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                    
                </DialogActions>
            </Dialog>
        </div>
    )

}