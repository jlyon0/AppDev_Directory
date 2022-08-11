import {useRouter} from 'next/router'
import { Button, Link, Grid, Typography } from '@mui/material';
import React from 'react';
import { useState} from 'react';
import { useUser, getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import Image from 'next/image';
const Profile = ({ userData }) => {
    const { user, error, isLoading } = useUser();
	const router = useRouter()
    const { id } = router.query

	// Initial checks
    if(!user)
        return;

    if(!userData.emplid)
        return <p>404 This page does not exist.</p>

	console.log("src", userData.profile.photo_url)

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
			<p>Profile: {id}</p>
			<div>
				<Grid container id="window" p={1} direction="column">
					<Grid container id="contact-and-photo" direction="row" justifyContent="space-between" >
						<Grid item id="contact-info">
							<Typography variant="h4">{userData['firstname']} {userData['lastname']}</Typography>
							Email: {userData.profile.email}  <br/>
							Phone: {userData.profile.phone}  <br/>
							Location: {userData.profile.location} <br/>
							<br/>
							Bio:   {userData.profile.bio}  <br/>
							
						</Grid>
						<Grid item id="photo">
							<Image src={userData.profile.photo_url} alt="Profile Photo" width="300" height="300"/>
							<br/>
							{Office_hours()}
						</Grid>
					</Grid>
					<Grid item id="documents">
						<Link href={process.env.minioUrl + userData.username + "-resume.pdf"}>
                            <Button  sx={{ visibility: resumeBtn}}>View Resume</Button>
                        </Link>
						<Link href={process.env.minioUrl + userData.username + "-cv.pdf"}>
							<Button sx={{ visibility: cvBtn}}>View Vitae</Button>
						</Link>
					</Grid>
				</Grid>
				
				
			</div>
		</div>
	)
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

export default Profile;