import {Link as RouterLink } from "react"

import { AppBar, Drawer, Container, Menu, MenuItem, Toolbar, Typography, Box, Button, Link, Avatar, Tooltip, IconButton} from '@mui/material'
import { useSession } from 'next-auth/react';
import {useState, useEffect} from "react"
import { useUser, getSession } from '@auth0/nextjs-auth0';
import MenuIcon from '@mui/icons-material';
import {styled} from '@mui/material/styles';
import { blue } from '@mui/material/colors';
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
let mobileMenu = [
    {
	title: 'Home',
	link: '/',
    },{
	title: 'Login',
	link: '/api/auth/login',
    }];

export default function Layout({ children }) {
    const { user, error, isLoading } = useUser()
    const [ avatarSrc, setAvatar] = useState("bulldog.jpg");
    const [ userInfo, setUserInfo] = useState(null);
    const [state,setState] = useState({
	    mobileView: false,
	    drawerOpen: false,
    })

    const { mobileView, drawerOpen } = state;
    const CustomButton = styled(Button)(({ theme }) => ({
	    color: theme.palette.getContrastText(blue[500]),
	    backgroundColor: blue[500],
	    '&:hover': {
		backgroundColor: blue[700],
	    },
    }));
    useEffect(() => {
	    const setResponsiveness = () => {
		    return window.innerWidth < 900
		        ? setState((prevState) => ({ ...prevState, mobileView: true }))
		        : setState((prevState) => ({ ...prevState, mobileView: false }));
	    }
	    setResponsiveness();
	    window.addEventListener("resize", () => setResponsiveness());

	    return () => {
		    window.removeEventListener("resize", () => setResponsiveness());
	    }
    }, []);

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
	
	let mobileMenu = [
    	    {
		title: 'Home',
		link: '/',
    	    },{
		title: "View Profile",
		link: '/view-profile',
	    },{
		title: 'Logout',
		link: '/api/auth/logout',
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
    const displayDesktop = () => {
	    return(

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
                                fontFamily: 'sans-sarif',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >Butler University</Typography>
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            {pages.map((page) => (
                                <Link href={page.link} >
                                    <Button
                                        key={page}
                                        sx={{ my: 2, color: 'white', display: 'block', fontFamily: 'sans-sarif'}} 
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
                                            <Typography 
						textAlign="center" 
						sx={{ fontFamily: 'sans-sarif' }}
					    >{setting.title}</Typography>
                                        </MenuItem>
                                    </Link>
                                    
                                ))}
                            </Menu>


                        </Box>
                    </Toolbar>
                </Container>
	    );
    }
    const displayMobile = () => {
	mobileMenu = [ 
    	    {
		title: 'Home',
		link: '/',
    	    },{
		title: 'Login',
		link: '/api/auth/login',
	    }];
	if(user){

	    mobileMenu = [
    	    	{
		    title: 'Home',
		    link: '/',
    		},{
		    title: "View Profile",
		    link: '/view-profile',
	    	},{
		    title: 'Logout',
		    link: '/api/auth/logout',
	    	}];
	}
	const handleDrawerOpen = () => {
		setState((prevState) => ({ ...prevState,drawerOpen: true }));
	}
	const handleDrawerClose = () => {
		setState((prevState) => ({ ...prevState, drawerOpen: false }));
	}
	const getDrawerChoices = () => {
		console.log("mobileMenu",mobileMenu);
		return mobileMenu?.map(({title, link})=> {
		    return(
			<Link
			    href={link}
			>
			    <MenuItem key={title}>
				<Typography sx={{ fontFamily: 'sans-sarif' }} textAlign="center">{title}</Typography>
			    </MenuItem>
			</Link>
		    )}
		);
	}

	return(
	    <Toolbar>
	    	<IconButton
	    	    {...{
			edge: "start",
			color: "inherit",
			"aria-label": "menu",
			"aria-haspopup": "true",
			onClick: handleDrawerOpen,
		    }}
	    	>
                    <IconButton onClick={handleDrawerOpen} sx={{ p:0 }}>
                    	<Avatar alt="User Photo" src={avatarSrc} />
                    </IconButton>
	    	</IconButton>
	        <Typography sx={{ fontFamily: 'sans-sarif' }}>Butler University</Typography>
		<Drawer
		    {...{
			anchor: "left",
			    open: drawerOpen,
			    onClose: handleDrawerClose,
		    }}
		>
		    <div>{getDrawerChoices()}</div>
		</Drawer>
	    </Toolbar>
	);
    }
    return (
        <>
            <AppBar position="static" >
	    	{mobileView ? displayMobile() : displayDesktop()}
            </AppBar>
                <main>{children}</main>
            {/* <Footer/> */}
        </>
    );
}
