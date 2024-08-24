import {Container, Box, Typography, Grid, IconButton} from '@mui/material';
import Navbar from '../components/navbar.js';
import Link from '@mui/material/Link';
import Image from 'next/image';
// for contacts
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import HomeIcon from '@mui/icons-material/Home';

export default function About() {
    // console.log(AboutImage);
    return (
        <Container maxWidth="lg" sx={{mb: 3, pt: 0}} height="100%">
            <Navbar />
            <Box sx={{mt: {xs:10, sm:12, md:14 }, pt:0}}>
                <Typography gutterBottom variant="h3" sx={{fontWeight:500, padding:0, margin:0}}>
                    About
                </Typography>
            </Box>

            <Grid container spacing={4} alignItems="center" sx={{paddingLeft: 0}}>
                {/* Left side: Text */}
                <Grid item xs={12} md={6} sx={{ paddingTop: 0 }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ paddingTop: 0, margin: 0 }}>
                        Welcome to Qwizzcards, your go-to platform for generating AI-powered flashcards from any text.
                        Whether you're a student preparing for exams, a professional brushing up on skills, or simply someone
                        who enjoys learning new things, Qwizzcards is designed to make studying easier and more efficient.
                        With just a few clicks, convert any information into concise, easy-to-review flashcards that you can
                        access from any device, anytime.
                    </Typography>
                </Grid>
                {/* Right side: image */}
                <Grid item xs={12} md={6} sx={{ padding: 0, margin: 0 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Image src="/assets/about.svg" width={400} height={325} alt="work from home" />
                    </Box>
                </Grid>
            </Grid>

            <Grid container spacing={4} alignItems="center" sx={{ paddingLeft: 0 }}>
                <Grid item xs={12} md={6} sx={{ paddingTop: 0 }}>
                    <Typography variant="body2">
                        Credits for logo and images go to{' '}
                        <Link href="https://www.figma.com/@designvthsuhas" passHref>
                            <a target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none', color: 'inherit'}}>
                                Suhas Palukuri
                            </a>
                        </Link>{' '}
                        under the CC-by-4.0 license.
                    </Typography>
                </Grid>
            </Grid>

            {/* social media icons */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    padding: 2,
                    backgroundColor: '#f0f0f0',
                }}
            >
                <IconButton href="https://github.com/angelay1006" target="_blank" rel="noopener noreferrer">
                    <GitHubIcon />
                </IconButton>
                <IconButton href="mailto:angela1006yeung@gmail.com" target="_blank" rel="noopener noreferrer">
                    <EmailIcon />
                </IconButton>
                <IconButton href="https://www.linkedin.com/in/angela-yeung-203134205/" target="_blank" rel="noopener noreferrer">
                    <LinkedInIcon />
                </IconButton>
                <IconButton href="https://angela-yeung-portfolio.vercel.app/" target="_blank" rel="noopener noreferrer">
                    <HomeIcon />
                </IconButton>
            </Box>

        </Container>
    );

}