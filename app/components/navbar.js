// import {AppBar, Toolbar, Typography, Button} from '@mui/material';
// import {SignedIn, SignedOut, UserButton} from '@clerk/nextjs';

// export default function Navbar() {
//     return (
//         <AppBar position="static">
//         <Toolbar>
//           <Typography variant="h6" style={{flexGrow: 1}} sx={{p:0}}> Flashcard SaaS </Typography>
//           <SignedOut>
//             <Button color="inherit" href="/sign-in"> Login </Button>
//             <Button color="inherit" href="/sign-up"> Sign Up </Button>
//           </SignedOut>
//           <SignedIn>
//             <UserButton />
//           </SignedIn>
//         </Toolbar>
//       </AppBar>
//     );
// }

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import '../globals.css';



function ResponsiveAppBar({ pages }) {
    // for mobile view: state to manage opening & closing of menu
    const [anchorElNav, setAnchorElNav] = React.useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    return (
        <AppBar position="static" sx={{width: '100vw', ml:{xs: -2, sm:-3}}}>
            <Container maxWidth={false}>
                <Toolbar disableGutters>

                    {/* for larger screens */}
                    <AdbIcon sx={{display: {xs:'none', md:'flex' }, mr:1 }}/>
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 5,
                            ml: 1,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.2rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        QwizzCards
                    </Typography>

                    {/* menu icon for mobile view */}
                    <Box sx={{flexGrow: 1, display: {xs:'flex', md:'none'}}}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
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
                                <MenuItem key={page.name} onClick={handleCloseNavMenu} sx={{paddingLeft: 1, justifyContent: 'flex-start'}}>
                                    <Link href={page.route} passHref style={{textDecoration:'none'}}>
                                        <Button sx={{color:'black', width: '100%', justifyContent:'flex-start'}} onClick={handleCloseNavMenu}>
                                            {page.name}
                                        </Button>
                                    </Link>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

                    {/* logo & title for mobile view */}
                    <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        QwizzCards
                    </Typography>

                    {/* nav links and menu items for larger screens */}
                    <Box sx={{mr: 5, alignItems: 'center', justifyContent:'space-between', flexGrow: 1, display: {xs:'none', md:'flex'}}}>
                        {pages.map((page) => (
                            <Button
                                key={page.name}
                                onClick={handleCloseNavMenu}
                                sx={{my: 1.5, mx:1, color:'white', display:'block', textAlign:'center'}}
                                href={page.route}
                            >
                                {page.name}
                            </Button>
                        ))}
                    </Box>

                    {/* authentication buttons */}
                    <Box sx={{ flexGrow: 0 }}>
                        <SignedOut>
                            <Button color="inherit" href="/sign-in" sx={{ ml: 1 }}> Login </Button>
                            <Button color="inherit" href="/sign-up" sx={{ ml: 1 }}> Sign Up </Button>
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