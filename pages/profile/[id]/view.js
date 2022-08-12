import { useRouter } from 'next/router'
import { Button, Link, Grid, Typography } from '@mui/material';
import React from 'react';
import { useState} from 'react';
import { useUser, getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import Image from 'next/image';
const Profile = ({ userData }) => {
	// Initial check
    if(!userData.emplid)
        return <p>404 This page does not exist.</p>

	const [resumeBtn, setResumeBtn] = useState("hidden");
    const [cvBtn, setCVBtn] = useState("hidden");

	const minioClient = require('../../../comps/minioClient');
	minioClient.statObject('directory', `${userData.username}-resume.pdf`, function(err) {
		if (err) {
			return console.log("Item does not exists", err);
		}else {
			setResumeBtn("visible");
		}
	})
	minioClient.statObject('directory', `${userData.username}-cv.pdf`, function(err) {
		if (err) {
			return console.log("Item does not exists", err);
		}else {
			setCVBtn("visible");
		}
	})

	function Office_hours() {
		const officeHours = JSON.parse(userData.profile.office_hours);
			return(
				<div>
					<Typography variant="h5">Office Hours:</Typography>
					<div>
						Monday: {officeHours.Monday}<br/>
						Tuesday: {officeHours.Tuesday}<br/>
						Wednesday: {officeHours.Wednesday}<br/>
						Thursday: {officeHours.Thursday}<br/>
						Friday: {officeHours.Friday}
					</div>
				</div>
			)
	}

    return (
		<div>
			<Link href={`/profile/${userData.emplid}/edit`} underline="none">
				<Button>Edit</Button>
			</Link>
			<Grid container id="window" p={1} direction="column" justifyContent="space-evenly">
				<Grid container id="contact-and-photo" direction="row" justifyContent="space-evenly" >
					<Grid item id="contact-info" width="325px">
						
						<br/>
						<Typography variant="h4">{userData['firstname']} {userData['lastname']}</Typography>
						<br/>
						<b>Email</b><br/>{userData.profile.email}<br/><br/>
						<b>Phone</b><br/>{userData.profile.phone}<br/><br/>
						<b>Location</b><br/>{userData.profile.location} <br/><br/>
						<b>Bio</b><br/>{userData.profile.bio}  <br/><br/>
					</Grid>
					<Grid item id="photo">
						<Image src={userData.profile.photo_url} alt="Profile Photo" width="300" height="300"/>
						<br/>
						{Office_hours()}
					</Grid>
				</Grid>
				<Grid container id="documents" direction="row" justifyContent="space-evenly" >
					<Grid item id="resume">
						<Link href={process.env.minioUrl + userData.username + "-resume.pdf"}>
							<Button  sx={{ visibility: resumeBtn}}>View Resume</Button>
						</Link>
					</Grid>
					<Grid>
						<Link href={process.env.minioUrl + userData.username + "-cv.pdf"}>
							<Button sx={{ visibility: cvBtn}}>View Vitae</Button>
						</Link>
					</Grid>
				</Grid>
			</Grid>
		</div>
	)
}

export async function getServerSideProps( context ){
	const { id } = context.query; 
	let url = process.env.apiUrl +"users/one/" + id + "?include=profile"
	let res = await fetch(url)
	let json = await res.json();
	const userData = json;
	return {
		props: {
			userData: userData,
		},
	};
};

export default Profile;