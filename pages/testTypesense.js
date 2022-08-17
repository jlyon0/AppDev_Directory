// Typesense

import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter";
import { Hits, InstantSearch, Pagination, RefinementList, SearchBox, SortBy } from 'react-instantsearch-dom';
import { assembleTypesenseServerConfig } from "../lib/utils";
import Hit from "../comps/Hit";
import {findResultsState} from 'react-instantsearch-dom/server';
import Head from "next/head";
import { Button, Checkbox, FormControlLabel, FormGroup, Grid, TextField } from "@mui/material";
import { useRef, useState } from "react";
import TypesenseProfileGrid from "../comps/typesenseProfileGrid";




export default function Home() {
	const [users, setUsers] = useState(null);
	const searchRef = useRef('');
	const [page, setPage] = useState(1);
	const [state, setState] = useState({
		sortAsc: false,
		superAdmins: false,
		studentAdmins: false,

	});
	

	const { sortAsc, superAdmins, studentAdmins } = state;
	const handleChange = async (event) => {
		setState({
			...state,
			[event.target.name]: event.target.checked,
		});
		
	};

	const handleSearch = async () =>{
		// Add department and title as searchable fields
		const refinement = document.getElementById("refinement");
		console.log("refinement", refinement);
        let endpoint = `${process.env.typesenseUrl}usersOne/documents/search?q=${searchRef.current.value}&num_typos=2&min_len_1typo=3&per_page=10&page=${page}`;
		if(state.group) {
			endpoint = endpoint + "&query_by=lastname,firstname,email,phone,userGroups"
		}else
			endpoint = endpoint + "&query_by=lastname,firstname,email,phone"
		if(state.sortAsc) {
			endpoint = endpoint + "&sort_by=emplid:asc"
		}
		if(state.superAdmins){
			endpoint = endpoint + "&filter_by=userGroups:=[super-admins]"
		}
		if(state.studentAdmins){
			endpoint = endpoint + "&filter_by=userGroups:=[student-admins]"
		}
		const options = {
            method: 'GET',
            headers: { 
				'x-typesense-api-key': `${process.env.typesenseAPI_KEY}`,
			},
        };

        const response = await fetch(endpoint, options);
        const result = await response.json();
		console.log("result", result);
		console.log("result.hits", result.hits)
		setUsers(result.hits)
		console.log("users", users)
	  };

	const handleKeyPress= (e) => {
		if(e.key === "Enter"){
		  handleSearch();
		}
		return;
	}
	function handleClickUp() {
		setPage(page + 1);
	}
	function handleClickDown() {
		setPage(page - 1);
	}

	return(
		<div>
			<Head>
				<title>Butler University Directory</title>
			</Head>
			<main>
				<Grid container direction="column" justifyContent="center" p={1} m={1}>
					<Grid item id="refinement">
						<FormGroup>
							{/* name inside checked{} must == name="" or the checkbox won't work*/}
							<FormControlLabel
								control={
									<Checkbox checked={sortAsc} onChange={handleChange} name="sortAsc" />
								}
								label="Sort Ascending"
								/>
							<FormControlLabel
								control={
									<Checkbox checked={superAdmins} onChange={handleChange} name="superAdmins" />
								}
								label="super-admin"
								/>
							<FormControlLabel
								control={
									<Checkbox checked={studentAdmins} onChange={handleChange} name="studentAdmins" />
								}
								label="student-admin"
								/>
						</FormGroup>
					</Grid>
					<br/>
					<Grid item id="searchbox">
						<TextField 
							inputRef={searchRef} 
							autoFocus
							id="srchDirectory"
							label="Search Directory"
							type="text"
							style={{width: '82%', height: 50}}
							variant="outlined"
							onKeyPress={(e) => handleKeyPress(e)}
						/>
					</Grid>
					<Grid item id="profileGrid">
						<TypesenseProfileGrid users={users}/>
					</Grid>
					{/* <Grid item id="pages">
						<button onClick={setPage(1)}>Previous</button>
						<button onClick={setPage(2)}>Next</button>
					</Grid> */}

				</Grid>
				
				
			</main>
		</div>
	)


}

