import {AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material';
import {SignUp, SignIn} from '@clerk/nextjs';
import Link from 'next/link';
import Navbar from '../../components/navbar';

export default function SignUpPage() {
    return (
        <Container maxWidth="100vw">
            <Navbar/>

            <Box marginTop="10vh" paddingTop="5vh" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                {/* <Typography gutterBottom variant="h4" style={{fontFamily: 'Montserrat, sans-serif', fontWeight: 500}}> Sign In </Typography> */}
                <SignUp sx={{mt:5}}/>
            </Box>
        
        </Container>
    );
}