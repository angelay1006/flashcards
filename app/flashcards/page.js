'use client'
import {useUser} from '@clerk/nextjs';
import {useEffect, useState} from 'react';
import {collection, doc, getDoc, setDoc, onSnapshot} from 'firebase/firestore';
import {db} from '../../firebase';
import {useRouter } from 'next/navigation';
import {Container, Button, Divider, Typography, CardContent, Box, Grid, Card, CardActionArea } from '@mui/material';
import Navbar from '../components/navbar.js';

// for limiting basic users from generating more than 5 collections:
export async function getFlashcardCollectionCount(userId) {
    try {
        const docRef = doc(collection(db, 'users'), userId);
        const docSnap = await getDoc(docRef);
    
        if (docSnap.exists() && docSnap.data().flashcards) {
            const collections = docSnap.data().flashcards || [];
            return collections.length;
        } else {
            return 0;
        }
    } catch (err) {
        console.error("Error getting flashcard collection count:", err);
        return 0;
    }
}

// gets user's doc from firestore and sets `flashcards` state with the user's collections
export default function Flashcards() {
    const {isLoaded, isSignedIn, user} = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const router = useRouter();

    useEffect(() => {
        // ensure all are loaded before running to prevent hydration error
        if (!isLoaded || !isSignedIn || !user) return;

        async function getFlashcards() {
            const docRef = doc(collection(db, 'users'), user.id);
            const unsubscribe = onSnapshot(docRef, (docSnap) => {
                if (docSnap.exists()) {
                    const collections = docSnap.data().flashcards || [];
                    setFlashcards(collections);
                } else {
                    setDoc(docRef, {flashcards: []});
                }
            });
            return () => unsubscribe();
        }
        getFlashcards();
    }, [isLoaded, isSignedIn, user])

    // don't want the page to load if the user isn't signed in
    if (!isLoaded) {
        return (
            <Container>
                <Navbar/>
                <Typography>
                    Loading...
                </Typography>
            </Container>
        );
    }

    if (!isSignedIn) {
        router.push('/sign-in');
        return (
            <Container>
                <Navbar/>
                <Typography>
                    Redirecting to sign-in...
                </Typography>
            </Container>
        );
    }

    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`, {state: {onDelete: handleDeleteCollection } });
    }

    const handleGenerateFlashcards = () => {
        router.push('/generate');
    }

    const handleDeleteCollection = (deletedCollectionName) => {
        setFlashcards((prevFlashcards) => 
            prevFlashcards.filter((flashcard) => flashcard.name !== deletedCollectionName)
        );
    }

    // Now to display all the flashcards
    return (
        <Container maxWidth="lg" sx={{mt: 15, mb: 5}} height="100%">
            <Navbar />
            <Typography variant="h3" gutterBottom style={{fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}>
                My Flashcard Collection
            </Typography>

            {flashcards.length === 0 ? (
                <Box sx={{mt: 5}}>
                    <Typography variant="h5" color="gray" gutterBottom>
                        You have no flashcard collections yet.
                        Start by generating your first set of flashcards!
                    </Typography>
                    <Box sx={{display: 'flex', alignItems:'center', justifyContent:'center', mt:5}}>
                        <Button variant="contained" size="large" color="primary" onClick={handleGenerateFlashcards}>
                            Generate Flashcards
                        </Button>
                    </Box>
                    
                </Box>
            ) : (
                <Grid container spacing={3} sx={{ mt: 3 }}>
                    {flashcards.map((flashcard, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card sx={{ borderRadius: '2', bgcolor: 'background.paper', boxShadow: 1, padding: 2, height: '100%' }}>
                                <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                                    <CardContent sx={{ ml: '1vw' }}>
                                        <Typography variant="h6" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                            {flashcard.name}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
}