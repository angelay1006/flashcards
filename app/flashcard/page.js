'use client'

import {useUser} from '@clerk/nextjs';
import {useEffect, useState } from 'react';
import {collection, doc, getDoc, getDocs, writeBatch} from 'firebase/firestore';
import {db} from '@/firebase';
import {useSearchParams, useRouter} from 'next/navigation';
import {Container, CardContent, CardActionArea, Button, Box, Typography, Grid} from '@mui/material';
import Navbar from '../components/navbar.js';

export default function Flashcard() {
    const {isLoaded, isSignedIn, user} = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState([]);

    const searchParams = useSearchParams();
    const search = searchParams.get('id');
    const router = useRouter();

    useEffect(() => {
        async function getFlashcard() {
            if (!search || !user) return

            const colRef = collection(doc(collection(db, 'users'), user.id), search);
            const docs = await getDocs(colRef);
            const flashcards = []

            docs.forEach((doc) => {
                flashcards.push({ id: doc.id, ...doc.data() });
            })
            setFlashcards(flashcards);
        }
        getFlashcard();
    }, [user, search]);


    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

    if (!isLoaded || !isSignedIn) {
        return <></>
    }

    const handleDeleteCollection = async () => {
        if (!user || !search) return;

        const confirmDelete = window.confirm("Are you sure you want to delete this collection? This action cannot be undone.");
        if (!confirmDelete) return;

        const batch = writeBatch(db);
        const userDocRef = doc(collection(db, 'users'), user.id);
        const colRef = collection(userDocRef, search);
        const docs = await getDocs(colRef);

        docs.forEach((doc) => {
            batch.delete(doc.ref);
        });

        // delete collection from user's flashcards array
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const updatedFlashcards = (userData.flashcards || []).filter(f => f.name !== search);
            batch.update(userDocRef, {flashcards: updatedFlashcards});
        }

        try {
            await batch.commit();
            alert("Collection deleted successfully.");
            router.push('/flashcards');
        } catch (err) {
            console.error("Error deleting collection:", err);
            alert("Failed to delete collection. Please try again.");
        }
    }

    return (
        <Container maxWidth="100vw" sx={{mb: 3}}>
            <Navbar />
            <Box sx={{ mt: { xs: 10, sm: 12 }, textAlign: 'center', justifyContent: 'center' }}>
                <Typography gutterBottom variant="h3" sx={{ fontWeight: 500 }}>
                    {search ? `My Collection Topic: ${search}` : 'Flashcards'}
                </Typography>
            </Box>

            <Grid container spacing={3} >
                {flashcards.map((flashcard, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <CardActionArea onClick={() => { handleCardClick(index) }}>
                            <CardContent>
                                <Box sx={{
                                    perspective: '1000px',
                                    '& > div': {
                                        transition: 'transform 0.6s',
                                        transformStyle: 'preserve-3d',
                                        position: 'relative',
                                        width: '100%',
                                        height: '200px',
                                        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                                        transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                        borderRadius: '16px'
                                    },
                                    '& > div > div': {
                                        position: 'absolute',
                                        width: '100%',
                                        height: '200px',
                                        backfaceVisibility: 'hidden',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        padding: 2,
                                        boxSizing: 'border-box',
                                        transform: 'rotateY(0deg)',
                                        overflow: 'auto',
                                    },
                                    '& > div > div:nth-of-type(2)': {
                                        transform: 'rotateY(180deg)',
                                        overflow: 'auto',
                                    }
                                }}
                                >
                                    <div>
                                        <div>
                                            <Typography variant="h5" component="div"> {flashcard.front} </Typography>
                                        </div>
                                        <div>
                                        <Typography variant="h5" component="div" sx={{maxHeight: '180px', overflowY: 'auto', padding: '10px'}}> 
                                                {flashcard.back} 
                                            </Typography>
                                        </div>
                                    </div>
                                </Box>
                            </CardContent>
                        </CardActionArea>
                    </Grid>
                ))}
            </Grid>

            <Box sx={{mt: 4, display: 'flex', justifyContent: 'center' }}>
                <Button variant="contained" color="secondary" onClick={handleDeleteCollection}>
                    Delete Collection
                </Button>
            </Box>
        </Container>
    )
}