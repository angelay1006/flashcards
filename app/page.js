'use client';

import Image from "next/image";
import getStripe from '@/utils/get-stripe';

import {Container, Box, Grid, AppBar, Toolbar, Typography, Button} from '@mui/material';
import Head from 'next/head';
import Navbar from '../app/components/navbar';
 

export default function Home() {
  // page navigation
  const pages = [
    {name: 'Home', route: '/' },
    {name: 'Flashcards', route: '/flashcards' },
    {name: 'Create', route: '/create' },
    {name: 'Subscribe', route: '/pro' },
    {name: 'About', route: '/about' }
  ]
  // for stripe
  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_session', {
      method: 'POST',
      headers: {
        origin: 'http://localhost:3000' // change later
      },
    });

    const checkoutSessionJSON = await checkoutSession.json();

    if (checkoutSession.statusCode === 500) {
      console.error(checkoutSession.message);
      return;
    }

    const stripe = await getStripe();
    const {error} = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJSON.id
    });

    if (error) {
      console.warn(error.message);
    }

  }

  return (
    <Container maxWidth="100vw" sx={{margin:0}}>
      <Head>
        <title> Flashcard SaaS </title>
        <meta name="description" content="Create flashcards from your text"/>
      </Head>

      {/* navbar */}
      <Navbar pages={pages}/>

      {/* intro */}
      <Box sx={{textAlign:"center", my: 4}} >
        <Typography variant="h2" gutterBottom> Welcome to Flashcard SaaS! </Typography>
        <Typography variant="h5" gutterBottom> The easiest way to make flashcards from your text. </Typography>
        <Button variant="contained" color="primary" sx={{mt: 2}}> Get Started </Button>
      </Box>

      {/* feature showcase */}
      <Box sx={{my:6, textAlign: 'center'}}>
        <Typography variant="h4" gutterBottom>
          Features
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom> Easy Text Input </Typography>
            <Typography> 
              {' '}
              Simply input your text and let our software do the rest. Creating flashcards has never been easier. 
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom> Smart Flashcards </Typography>
            <Typography> 
              {' '}
              Our AI intelligently breaks down your text into concise flashcards, perfect for studying.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom> Accessible Anywhere </Typography>
            <Typography> 
              {' '}
              Access your flashcards from any device, at any time. Study on the go with ease. 
            </Typography>
          </Grid>
        </Grid>

      </Box>

      {/* pricing */}
      <Box sx={{my:6, textAlign: 'center'}}>
        <Typography variant="h4" gutterBottom> Pricing </Typography>
      
      <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box 
              sx={{
                p: 3, 
                border: '1px solid', 
                borderColor: 'grey.300', 
                borderRadius: 2
              }}
            >
              <Typography variant="h5"> Basic </Typography>
              <Typography variant="h6"> $5/month </Typography>
              <Typography>
                {' '}
                Access to basic flashcard features and limited storage. 
              </Typography>
              <Button variant="contained" color="primary" sx={{mt: 2}}> Choose basic </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box 
              sx={{
                p: 3, 
                border: '1px solid', 
                borderColor: 'grey.300', 
                borderRadius: 2
              }}
            >
              <Typography variant="h5"> Pro </Typography>
              <Typography variant="h6"> $10/month </Typography>
              <Typography>
                {' '}
                Augmented flashcards and storage, with priority support.
              </Typography>
              <Button variant="contained" color="primary" sx={{mt: 2}} onClick={handleSubmit}> Choose pro </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      
    </Container>
  );
}
