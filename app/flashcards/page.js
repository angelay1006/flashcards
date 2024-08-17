'use client'
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useRouter } from 'next/navigation';
import { Container, Typography, CardContent, Box, Grid, Card, CardActionArea } from '@mui/material';

// gets user's doc from firestore and sets `flashcards` state with the user's collections
export default function Flashcards() {
    const {isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const router = useRouter();

    // useEffect(() => {
    //     console.log(router);
    // }, [router]);
    

    useEffect(() => {
        async function getFlashcards() {
            if (!user) return
            
            const docRef = doc(collection(db, 'users'), user.id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const collections = docSnap.data().flashcards || [];
                setFlashcards(collections);
            } else {
                await setDoc(docRef, { flashcards: [] });
            }
        }
        getFlashcards();
    }, [user])

    // don't want the page to load if the user isn't signed in
    if (!isLoaded || !isSignedIn) {
        return <></>
    }

    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`);
    }

    // now to display all the flashcards
    return (
        <Container maxWidth="100vw">
            <Grid container spacing={3} sx={{ mt: 4 }}>
                {flashcards.map((flashcard, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card>
                            <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                                <CardContent>
                                    <Typography variant="h6">
                                        {flashcard.name}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>)
                )}
            </Grid>
        </Container>
    );
}