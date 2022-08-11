import { Box, Button, TextField, Link } from '@mui/material';
import React from 'react';
import { useState, useRef } from 'react';
import { useUser, getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router';

export default function EditProfile({userData, profile}) {

	const emailRef = useRef('');
	const phoneRef = useRef('');
	const locationRef = useRef('');
	const firstRef = useRef('');
	const lastRef = useRef('');
	const bioRef = useRef('');
	const officeHoursRef = useRef('');

    return(
        <div>
       	    <Box sx={{ direction: 'column', m: 3, width: '90%', alignItems: 'center', justifyContent: 'center'}}>            
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
                    />
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
                    />
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
                    />
                    
                    
               	    <br/> 
	    </Box>
        </div>
    )
}
export const getServerSideProps = withPageAuthRequired({
	returnTo: '/',
	async getServerSideProps(ctx) {
		const session = getSession(ctx.req, ctx.res);
		
		const emplid = session.user['https://my.butler.edu/app_metadata'].employeenumber
		let url = `${process.env.apiUrl}/users/${emplid}`
		let res = await fetch(url)
		let json = await res.json();

		const userData = json;
	// correct one is commented out 
        // url = `${process.env.apiUrl}/profiles/${emplid}`
        url = `${process.env.apiUrl}/profiles/${emplid}`
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
