

import { AppBar, Container, Menu, MenuItem, Toolbar, Typography, Box, Button, Link, Avatar, Tooltip, IconButton} from '@mui/material'
import { useSession } from 'next-auth/react';
import {useState} from "react"



let pages =[
    {
        title: 'Home',
        link: '/',
    },{
        title: 'Edit Profile',
        link: '/edit-profile/'
    }];

const settings = [
    {
        title: 'login',
        link: "/api/auth/signin",
    },{
        title: 'Logout',
        link: "/api/auth/signout",
    }];

export default function Layout({ children }) {
    const { data: session } = useSession()

    if(session) {
        console.log("User is logged in fetching avatar picture")
        console.log("Signed in as")
        console.log(session.user.name)
    }else {
        console.log("Not Signed in")
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
                                    <Avatar alt="User Photo" src="/chimp2.jpg" />
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
    )
}