import fetch from "node-fetch";
import fs from 'fs'

async function main() {	
	const req = await fetch(`https://docker-dev.butler.edu:3002/users?skip=0&limit=100&include=groups`)
	const json = await req.json();
	console.log(json)

	json.forEach(element => {
		delete element.profile;
		delete element.middlename;
		delete element.location;
		delete element.photo_url;
		console.log("UserGroup", element.userGroups)

		let groups = [];
		element.userGroups.forEach(element => {
			groups.push(element.group.name);
		})
		element.userGroups = groups;	
	});
	console.log("new", json)

	
	const stringy = JSON.stringify(json)

	

	fs.writeFile('/srv/stack/AppDev_Directory/output.jsonl', stringy, err => {
		if(err)
			console.log(err);
	});

}
main();