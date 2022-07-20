import { Button, TextField } from "@mui/material";
import { useState, useRef } from "react";
import ProfileGrid from "../comps/profileGrid";
export default function directory() {
  const [,setRefresh] = useState(false)
  
  const [profiles, setProfiles] = useState([
    {
      id: "temp"
    }
  ]);
  const [users, setUsers] = useState([
    {
      id: "temp"
    }
  ])

  const searchRef = useRef('');
  let ids = [];
  

  const handleSearch = async () =>{
    if(searchRef.current.value == ""){
      getAllUsers;
    }
      
    
    console.log("Search: " +searchRef.current.value);
    console.log("Fetching profiles")
    let res = await fetch(`${process.env.apiUrl}/search?terms=${searchRef.current.value}&skip=0&limit=100`);
    let json = await res.json();  
    setUsers(json);

  };

  const getAllUsers = async() => {
    console.log("Fetching profiles")
    const options = {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
      }
    }
    // const res = await fetch(`${process.env.apiUrl}/users?skip=0&limit=100`, options)
    const res = await fetch(`${process.env.apiUrl}/users?skip=0&limit=100`, options)
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
        <title>Butler Directory</title>
          
        <h2>Search the Butler University Directory</h2>
        <br/>
        
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
        
        <br/>
        <br/>
        <Button onClick={getAllUsers} >Search all faculty/staff</Button>  
        <ProfileGrid users={users}/>              
      </div>
  )
}
