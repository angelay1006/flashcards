'use client'
import {useUser} from '@clerk/nextjs';
import {useEffect, useState} from 'react';
import {collection, doc, getDoc, setDoc, onSnapshot} from 'firebase/firestore';
import {db} from '../../firebase';
import {useRouter } from 'next/navigation';
import {Container, Divider, Typography, CardContent, Box, Grid, Card, CardActionArea } from '@mui/material';
import Navbar from '../components/navbar.js';

// gets user's doc from firestore and sets `flashcards` state with the user's collections
export default function Flashcards() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const router = useRouter();

    useEffect(() => {
        async function getFlashcards() {
            if (!user) return

            const docRef = doc(collection(db, 'users'), user.id);
            // const docSnap = await getDoc(docRef);
            // if (docSnap.exists()) {
            //     const collections = docSnap.data().flashcards || [];
            //     setFlashcards(collections);
            // } else {
            //     await setDoc(docRef, { flashcards: [] });
            // }
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
    }, [user])

    // don't want the page to load if the user isn't signed in
    if (!isLoaded || !isSignedIn) {
        return <></>
    }

    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`, { state: { onDelete: handleDeleteCollection } });
    }

    const handleDeleteCollection = (deletedCollectionName) => {
        setFlashcards((prevFlashcards) => 
            prevFlashcards.filter((flashcard) => flashcard.name !== deletedCollectionName)
        );
    }


    // now to display all the flashcards
    return (
        <Container maxWidth="lg" sx={{mt: 15, mb:5}} height="100%">
            <Navbar />
            <Typography variant="h3" gutterBottom style={{fontFamily: 'Poppins, sans-serif', fontWeight: 500}}> My Flashcard Collection </Typography>
            
            <Grid container spacing={3} sx={{mt: 3}}>
                {flashcards.map((flashcard, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card sx={{borderRadius:'2', bgcolor: 'background.paper', boxshadow:1, padding:2, height:'100%'}}>
                            <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                                <CardContent sx={{ml:'1vw'}}>
                                    <Typography variant="h6" style={{fontFamily: 'Poppins, sans-serif'}}>
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