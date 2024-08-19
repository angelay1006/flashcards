import {Container, CardContent, CardActionArea, Button, Box, Typography, Grid} from '@mui/material';
import Navbar from '../components/navbar.js';

export default function About() {
    return (
        <Container maxWidth="100vw" sx={{mb: 3}}>
            <Navbar />
            <Box sx={{ mt: { xs: 10, sm: 12 }, textAlign: 'center', justifyContent: 'center' }}>
                <Typography gutterBottom variant="h3" sx={{ fontWeight: 500 }}>
                    placeholder text until i get to this shit !!!!
                </Typography>
            </Box>
        </Container>
    );

}