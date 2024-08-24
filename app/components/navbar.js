'use client';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
// import MenuIcon from '@mui/icons-material/Menu';
import LogoIcon from '../../public/assets/logo.svg';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import {SignedIn, SignedOut, UserButton} from '@clerk/nextjs';
import Link from 'next/link';
import '../globals.css';
import {useUser} from '@clerk/nextjs';
import {useRouter} from 'next/navigation';
import {useNavbarPages} from '../hooks/useNavbarPages';



function ResponsiveAppBar() {
    // for mobile view: state to manage opening & closing of menu
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const pages = useNavbarPages();
    const router = useRouter();

    // for the subscribe button
    const handleNavigation = (route) => {
        if (route === 'pricing') {
            if (router.pathname === '/') {
                // If on the homepage, scroll to the pricing section
                document.getElementById('pricing').scrollIntoView({behavior: 'smooth'});
            } else {
                // Otherwise, navigate to the homepage and then scroll to pricing
                router.push('/#pricing');
            }
        } else {
            router.push(route);
        }
    }

    const handleMenuClick = (route) => {
        handleCloseNavMenu();
        handleNavigation(route);
    }



    return (
        <AppBar position="fixed" sx={{width: '100vw', fontFamily: 'DM Sans, sans-serif'}}>
            <Container maxWidth={false}>
                <Toolbar disableGutters sx={{display: 'flex', justifyContent: {xs:'center', lg:'space-between'}, overflow: 'hidden' }}>

                    {/* for larger screens */}
                    <Box display="flex" direction="column" alignItems="center" justifyContent="center">
                        <AdbIcon sx={{display: {xs:'none', md:'flex'}}}/>
                        <Typography
                            variant="h6"
                            // noWrap
                            component="a"
                            href="/"
                            sx={{
                                mr: 5,
                                ml: 1,
                                display: {xs:'none', md:'flex' },
                                fontFamily: 'DM Sans, sans-serif',
                                fontWeight: 700,
                                letterSpacing: '.1rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                        QwizzCards
                        </Typography>

                    </Box>
                    

                    {/* menu icon for mobile view */}
                    {/* <Box sx={{flexGrow: 1, display: {xs:'flex', md: 'flex', lg: 'none'}}}> */}
                    <Box sx={{display: {xs: 'flex', md: 'none' }, flexGrow: 1, justifyContent: 'flex-start'}}>
                        <IconButton
                            size="medium"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                            sx={{marginLeft: {xs:'0'}, }}
                        >
                            <LogoIcon />
                        </IconButton>

                        {/* contains nav links for mobile view */}
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{vertical:'bottom', horizontal:'left'}}
                            keepMounted
                            transformOrigin={{vertical: 'top', horizontal: 'left'}}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{display: {xs: 'block', md: 'none'}, transform: 'translateY(0.5em)'}}
                        >
                            {/* create MenuItem for each page in mobile view */}
                            {pages.map((page) => (
                                <MenuItem key={page.name} onClick={() => handleMenuClick(page.route)} sx={{justifyContent: 'flex-start'}}>
                                    <Link href={page.route} passHref style={{textDecoration:'none'}}>
                                        <Button sx={{color:'black', width: '100%', justifyContent:'flex-start', fontFamily: 'DM Sans, sans-serif',}} onClick={handleCloseNavMenu}>
                                            {page.name}
                                        </Button>
                                    </Link>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

                    {/* logo & title for mobile view */}
                    <AdbIcon sx={{display: {xs:'flex', md: 'none' }, mr: 1}} />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            display: {xs:'flex', md:'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.1rem',
                            color: 'inherit',
                            textDecoration: 'none',
                            fontFamily: 'DM Sans, sans-serif',
                        }}
                    >
                        QwizzCards
                    </Typography>

                    {/* nav links and menu items for larger screens */}
                    <Box sx={{mr: {xs:0, md:6}, alignItems: 'center', justifyContent:'flex-start', flexGrow: 1, display: {xs:'none', md:'flex'}}}>
                        {pages.map((page) => (
                            <Button
                                key={page.name}
                                // for the subscribe button, we just want to link to the pricing section on homepage
                                onClick={() => handleMenuClick(page.route)}
                                sx={{my: 1.5, mx:2, color:'white', display:'block', textAlign:'center', fontFamily: 'DM Sans, sans-serif'}}
                            >
                                {page.name}
                            </Button>
                        ))}
                    </Box>

                    {/* authentication buttons */}
                    <Box sx={{
                            paddingLeft: {xs:0.5}, 
                            marginRight: {xs:1.3},
                            flexGrow: 0, 
                            gap: {xs:0, md:3},
                            display: {xs: "flex"}, 
                            justifyContent: {xs: "flex-end"}
                        }}
                    >
                        <SignedOut>
                            <Button color="inherit" href="/sign-in" 
                                sx={{ml:0, 
                                    fontFamily:'DM Sans, sans-serif', 
                                    fontSize: {xs: '0.7rem', sm: '1rem', md: '0.9rem', lg: '0.9rem'},
                                    paddingRight: {xs:'0.2rem'}
                                }}
                            > 
                                Login 
                            </Button>
                            <Button color="inherit" href="/sign-up" 
                                sx={{ml: 0, fontFamily: 'DM Sans, sans-serif',
                                      fontSize: {xs: '0.7rem', sm: '1rem', md: '0.9rem', lg: '0.9rem'},
                                      paddingLeft: {xs:'0,2rem'}
                                }}
                            > 
                                Sign Up 
                            </Button>
                        </SignedOut>
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default ResponsiveAppBar;