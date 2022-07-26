

import { AppBar, Container, Menu, MenuItem, Toolbar, Typography, Box, Button, Link, Avatar, Tooltip, IconButton} from '@mui/material'
import { useSession } from 'next-auth/react';
import {useState, useEffect} from "react"
import { useUser, getSession } from '@auth0/nextjs-auth0';


let pages =[
    {
        title: 'Home',
        link: '/',
    }];

let settings = [
    {
        title: 'Login',
        link: "/api/auth/login",
    }];

export default function Layout({ children }) {
    const { user, error, isLoading } = useUser()
    const [ avatarSrc, setAvatar] = useState("bulldog.jpg");
    const [ userInfo, setUserInfo] = useState(null);

    const getProfile = async() => {
					
	const emplid = user['https://my.butler.edu/app_metadata'].employeenumber
	const url = `${process.env.apiUrl}/users/${emplid}`
	const res = await fetch(url);
	const json = await res.json();
	if(userInfo == null)
	    setUserInfo(json);
    }
    if(user) {
       pages = [     
	    {
                title: 'Home',
                link: '/',
            },{
                title: 'View Profile',
                link: '/view-profile/'
            }];
	settings = [    
    	    {
        	title: 'Logout',
        	link: "/api/auth/logout",
    	    }];

        if(userInfo == null){
	    getProfile();
	}
	if(avatarSrc == "bulldog.jpg" && userInfo) {
		setAvatar(userInfo.photo_url);
	}
    
    } 

    const [anchorElUser, setAnchorElUser] = useState(null);
    
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
      };
    const handleCloseUserMenu = () => {
        setAnchorElUser("")
      };
    function handleClickSetting({setting}) {

    }
    return (
        <>
            <AppBar position="static" >
                <Container maxWidth="xl">
                    <Toolbar color="blue">
                        <Typography
                            variable="h6"
                            noWrap
                            component="a"
                            href="/"
                            sx={{
                                mr:2,
                                display: { xs: 'none', md: 'flex'},
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >LOGO</Typography>
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            {pages.map((page) => (
                                <Link href={page.link} >
                                    <Button
                                        key={page}
                                        sx={{ my: 2, color: 'white', display: 'block' }}
                                    >
                                        {page.title}
                                    </Button>
                                </Link>
                            ))}
                        </Box>
                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p:0 }}>
                                    <Avatar alt="User Photo" src={avatarSrc} />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                {settings.map((setting) => (
                                    <Link href={setting.link}>
                                        <MenuItem key={setting.title} onClick={handleClickSetting({setting})}>
                                            <Typography textAlign="center">{setting.title}</Typography>
                                        </MenuItem>
                                    </Link>
                                    
                                ))}
                            </Menu>


                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
                <main>{children}</main>
            {/* <Footer/> */}
        </>
    );
}
