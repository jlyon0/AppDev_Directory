import { Box, Button, TextField } from "@mui/material";
import { useState, useRef } from "react";
import ProfileGrid from "../comps/profileGrid";
export default function directory() {
  const [users, setUsers] = useState(null);

  const searchRef = useRef('');
  
  const handleSearch = async () =>{
    if(searchRef.current.value == ""){
      getAllUsers;
    }
 
    let res = await fetch(`${process.env.apiUrl}search?terms=${searchRef.current.value}&skip=0&limit=100`);
    let json = await res.json();  
    if(json.length == 0){
	    setUsers(null);
    }else{
	    setUsers(json);
    }
  };

  const getAllUsers = async() => {
    const options = {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
      }
    }
    const res = await fetch(`${process.env.apiUrl}users?skip=0&limit=100`, options)
    const json = await res.json();
    setUsers(json);
  }
  const handleKeyPress= (e) => {
    if(e.key === "Enter"){
      handleSearch();
    }
    return;
  }
 
   return(
      <div>
        <Box padding={2}>
          <title>Butler Directory</title>
          <h2>Butler University Directory</h2><br/>
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
          <Button
            onClick={handleSearch}
            style={{width: '10%', height: 50}}
            >Search
          </Button>
          <br/><br/>
          <Button onClick={getAllUsers} >View all faculty/staff</Button>
        </Box>  
        <ProfileGrid users={users}/>              
      </div>
  )
}