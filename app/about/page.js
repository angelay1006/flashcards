import {Container, Box, Typography, Grid} from '@mui/material';
import Navbar from '../components/navbar.js';
// import AboutImage from '../assets/about.svg';
import Image from 'next/image';

export default function About() {
    // console.log(AboutImage);
    return (
        <Container maxWidth="lg" sx={{mb: 3}} height="100%">
            <Navbar />
            <Box sx={{mt: {xs:10, sm:12, md: 14}}}>
                <Typography gutterBottom variant="h3" sx={{fontWeight: 500}}>
                    About
                </Typography>
            </Box>

            <Grid container spacing={4} alignItems="center">
                {/* Left side: Text */}
                <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>
                        Welcome to Qwizzcards, your go-to platform for generating AI-powered flashcards from any text.
                        Whether you're a student preparing for exams, a professional brushing up on skills, or simply someone
                        who enjoys learning new things, Qwizzcards is designed to make studying easier and more efficient.
                        With just a few clicks, convert any information into concise, easy-to-review flashcards that you can 
                        access from any device, anytime. 
                    </Typography>
                </Grid>
                {/* Right side: image */}
                <Grid item xs={12} md={6}>
                    <Box sx={{display:'flex', justifyContent:'center'}}>
                        <Image src="/assets/about.svg" width={400} height={300} alt="work from home"/>
                    </Box>

                </Grid>



            </Grid>

            
        </Container>
    );

}