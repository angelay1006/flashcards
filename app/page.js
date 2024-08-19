'use client';

import getStripe from '@/utils/get-stripe';
import Image from 'next/image';
import { Container, Box, Grid, Typography, Button, Divider } from '@mui/material';
import Head from 'next/head';
import Navbar from '../app/components/navbar';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { SignedIn, SignedOut, UserButton, isSignedIn } from '@clerk/nextjs';
import flashcards from './assets/flashcards.svg';
import feature_1 from './assets/feature_1.svg';
import feature_2 from './assets/feature_2.svg';
import feature_3 from './assets/feature_3.svg';
import hero_1 from './assets/hero_1.svg';
import hero_2 from './assets/hero_2.svg';
import hero_3 from './assets/hero_3.svg';
import theme from './theme.js';


export default function Home() {
  const router = useRouter();
  const {isSignedIn} = useUser();

  // for get started button
  const handleGetStarted = () => {
    if (isSignedIn) {
      router.push('/generate'); // Redirect to the "Generate" page if signed in
    } else {
      router.push('/sign-in'); // Redirect to the "Sign In" page if not signed in
    }
  };

  // for un-signedin users who click "sign in to get basic"
  const handleGetBasic = () => {
    router.push('/sign-in');
  }


  // for stripe
  const handleGetPro = async () => {
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
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJSON.id
    });

    if (error) {
      console.warn(error.message);
    }
  }

  return (
    <Container maxWidth="100%" sx={{ margin: 0, paddingTop: '10vh' }}>
      <Head>
        <title> QwizzCards: A Flashcard SaaS </title>
        <meta name="description" content="Create AI-powered flashcards from any text!" />
      </Head>

      {/* navbar */}
      <Navbar />

      {/* intro */}
      <Box sx={{ textAlign: "center", my: 10 }}>
        <Typography variant="h2" gutterBottom style={{fontFamily: 'Poppins, sans-serif', fontWeight: 500}}> Welcome to QwizzCards </Typography>

        <Box sx={{ my: 8 }}>
          <Image src={flashcards} alt="flashcards landing image" style={{ width: '70%', height: 'auto' }} />
        </Box>

        <Typography variant="h6" gutterBottom sx={{ mt: 6 }} style={{ fontFamily: 'Poppins, sans-serif' }}> The easiest way to make flashcards from your text. </Typography>

        <Button variant="contained" color="primary" size="large" onClick={handleGetStarted} sx={{ mt: 4 }}> Get Started </Button>
      </Box>

      {/* divider */}
      <Divider margintop="15vh" />

      {/* feature showcase */}
      <Box sx={{ my: 6, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h3" gutterBottom sx={{ mb: 6 }} style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 500 }}>
          Features
        </Typography>
        <Grid container spacing={5} width="95%" justifyContent='center'>
          <Grid item xs={12} md={4}>
            <Box sx={{
              boxShadow: 1,
              border: 1,
              borderRadius: 2,
              p: 2,
              minWidth: 300,
              borderColor: theme.palette.primary.main,
              boxShadow: 'none',
            }}>
              <Typography variant="h6" gutterBottom> Easy Text Input </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <Image src={feature_1} alt="feature 1 pic" style={{ width: '70%', height: '30vh', objectFit: 'contain' }} />
              </Box>
              <Typography variant="body2">
                {' '}
                Simply input your text and let our software do the rest when creating flashcards.
              </Typography>
            </Box>

          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{
              boxShadow: 1,
              border: 1,
              borderRadius: 2,
              p: 2,
              minWidth: 300,
              borderColor: theme.palette.primary.main,
            }}>
              <Typography variant="h6" gutterBottom> Smart Flashcards </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <Image src={feature_2} alt="feature 2 pic" style={{ width: '70%', height: '30vh', objectFit: 'contain' }} />
              </Box>
              <Typography variant="body2">
                {' '}
                Our AI intelligently breaks down your text into concise flashcards, perfect for studying.
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{
              boxShadow: 1,
              border: 1,
              borderRadius: 2,
              p: 2,
              minWidth: 300,
              borderColor: theme.palette.primary.main,
            }}>
              <Typography variant="h6" gutterBottom> Accessible Anywhere </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <Image src={feature_3} alt="feature 3 pic" style={{ width: '70%', height: '30vh', objectFit: 'contain' }} />
              </Box>
              <Typography variant="body2">
                {' '}
                Access your flashcards from any device, at any time. Study on the go with ease.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Divider />

      {/* pricing */}
      <Box id="pricing" sx={{my: 6, display: 'flex', flexDirection: 'column', textAlign: 'center', justifyContent: 'center' }}>
        <Typography variant="h3" gutterBottom sx={{mb:5}} style={{fontFamily: 'Poppins, sans-serif', fontWeight: 500}}>
          Pricing
        </Typography>

        <Grid container spacing={0} justifyContent="center" alignItems="stretch">
          <Grid item xs={12} md={5.5} sx={{display:'flex', justifyContent:'center'}}>
            <Box
              spacing={3}
              sx={{
                p: 3,
                borderColor: theme.palette.primary.main,
                border: 1,
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Typography variant="h5"> Basic </Typography>
              <Typography variant="body1"> Free </Typography>
              <Typography>
                {' '}
                Access to basic flashcard features and limited storage.
              </Typography>
              <Button 
                variant="contained"
                color="primary"
                sx={{mt: 2}}
                disabled={isSignedIn}
                onClick={handleGetBasic}
              > 
                {isSignedIn ? "Selected" : "Sign in for Basic"}
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={5.5} sx={{display:'flex', justifyContent:'center'}}>
            <Box
              spacing={3}
              sx={{
                p: 3,
                borderColor: theme.palette.primary.main,
                border: 1,
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Typography variant="h5"> Pro </Typography>
              <Typography variant="body1"> $0.99/month </Typography>
              <Typography>
                {' '}
                Unlimited storage, latest updates, and priority support.
              </Typography>
              <Button variant="contained" color="primary" onClick={handleGetPro} sx={{mt:2}}> Choose pro </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>


    </Container>
  );
}
