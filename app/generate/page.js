'use client'

import {useUser} from '@clerk/nextjs';
import {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {Container, CardContent, CardActionArea, Dialog, DialogTitle, DialogActions, DialogContent, Button, Box, Typography, Paper, TextField, Grid, DialogContentText } from '@mui/material';
import {doc, getDoc, collection, writeBatch} from 'firebase/firestore';
import LinearProgress from '@mui/material/LinearProgress';
import {db} from '../../firebase';
import Navbar from '../components/navbar.js';
import {getFlashcardCollectionCount} from '../flashcards/page';

export default function Generate() {
    const {isSignedIn, user} = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [text, setText] = useState('');
    const [name, setName] = useState('');
    const [open, setOpen] = useState(false); // for modals
    const router = useRouter();
    // for loading animation
    const [isLoading, setIsLoading] = useState(false);
    // for distinguishing basic and pro
    const [isLimitReached, setIsLimitReached] = useState(false);
    const [collectionCount, setCollectionCount] = useState(0);
    
    useEffect(() => {
        const checkCollectionLimit = async () => {
            if (user) {
                console.log("User public metadata:", user.publicMetadata);
                if (user.publicMetadata?.proUser === true) {
                    console.log("User is a pro user");
                    setIsLimitReached(false);
                    setCollectionCount(0);
                } else {
                    const count = await getFlashcardCollectionCount(user.id);
                    console.log("User flashcard collection count:", count);
                    setCollectionCount(count);
                    setIsLimitReached(count >= 5);
                }
            }
        };
        checkCollectionLimit();
    }, [user]);

    


    // submits the text to generate flashcards. sends to API
    const handleSubmit = async () => {
        setIsLoading(true); // Start loading
        fetch('api/generate', {
            method: 'POST',
            body: text,
        })
            .then((res) => res.json())
            .then((data) => {
                setFlashcards(data);
                setIsLoading(false); // Stop loading after data is received
            })
            .catch(() => {
                setIsLoading(false); // in case of error, stop loading
            })
    }

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    // save our flashcards
    const saveFlashcards = async () => {
        if (!name) {
            alert('Please enter a name');
            return
        }

        setIsLoading(true);

        const batch = writeBatch(db);
        const userDocRef = doc(collection(db, 'users'), user.id);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
            const collections = docSnap.data().flashcards || [];
            if (collections.find((f) => f.name === name)) {
                alert("Flashcard collection with the same name already exists");
                return
            } else {
                collections.push({ name });
                batch.set(userDocRef, { flashcards: collections }, { merge: true });
            }
        } else {
            batch.set(userDocRef, { flashcards: [{ name }] });
        }

        const colRef = collection(userDocRef, name);
        flashcards.forEach((flashcard) => {
            const cardDocRef = doc(colRef);
            batch.set(cardDocRef, flashcard);
        })

        // error handling
        try {
            await batch.commit();
            console.log('Batch committed successfully.');
            handleClose();
        } catch (error) {
            console.error('Error committing batch:', error);
            alert('Failed to save flashcards. Please try again.');
        } finally {
            setIsLoading(false); // we have saved
        }

        router.push('/flashcards'); // push to flashcards page
    }

    return (
        <Container maxWidth="md">
            <Navbar />
            <Box sx={{mt: { xs: 10, sm: 12 }, mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h3" gutterBottom sx={{ textAlign: 'center' }}> Generate Flashcards </Typography>
                <Typography variant="body2" gutterBottom sx={{ mb: 3, color: 'gray', textAlign: 'center' }}> Qwizz will generate a set of 10 flashcards based on any information you enter</Typography>
                <Paper variant="outlined" elevation={0} sx={{ p: 4, width: '100%', backgroundColor: '#F5F7FF', borderRadius: '20px' }}>
                    <TextField
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        label={isLimitReached ? "You have reached the 5-collection limit for basic users. To continue generating, please either purchase Pro or delete a collection.":"Enter topic or paste in your notes"}
                        fullWidth multiline
                        rows={4}
                        variant="outlined"
                        sx={{mb: 2, backgroundColor: 'white'}}
                        disabled={isLimitReached}
                        InputLabelProps={{
                            style: {
                                whiteSpace: 'normal',
                                wordWrap: 'break-word',
                            }
                        }}
                    />
                    <Box sx={{display: 'flex', justifyContent: 'center'}}>
                        {isLoading ? (
                            <Box sx={{ width: '100%' }}>
                                <LinearProgress />
                            </Box>
                        ) : (
                            <Button variant="contained" color="primary" onClick={handleSubmit} disabled={isLimitReached}>
                                Submit
                            </Button>
                        )}
                    </Box>
                </Paper>
            </Box>

            {flashcards.length > 0 && (
                <Box sx={{mt: {xs:8, sm:8}, mb:2, display:'flex', flexDirection:'column', alignItems:'center'}}>
                    <Typography variant="h4" sx={{mb: 3}} gutterBottom> Flashcards Preview </Typography>
                    <Grid container spacing={3}>
                        {flashcards.map((flashcard, index) => (
                            <Grid item xs={12} sm={6} md={6} key={index}>
                                <CardActionArea onClick={() => {handleCardClick(index) }}>
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
                                                borderRadius: '16px',
                                            },
                                            '& > div > div': {
                                                position: 'absolute',
                                                width: '100%',
                                                height: '100%',
                                                backfaceVisibility: 'hidden',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                padding: 2,
                                                boxSizing: 'border-box',
                                                transform: 'rotateY(0deg)',
                                                overflow: 'auto',
                                                display: 'flex',
                                                flexDirection: 'column'
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

                    <Box sx={{mt:4, display:'flex', justifyContent:'center'}}>
                        <Button variant="contained" color="secondary" onClick={handleOpen}>
                            Save
                        </Button>
                    </Box>
                </Box>
            )}

            {/* modal */}
            <Dialog open={open} onClose={handleClose}>
                {isLoading ? <DialogTitle> Saving...</DialogTitle> : <DialogTitle> Save Flashcards </DialogTitle>}
                <DialogContent>
                    {isLoading ? (
                        <Box sx={{display:'flex', justifyContent: 'center', alignItems: 'center', minHeight: '10vh', minWidth: '30vw'}}>
                            <LinearProgress sx={{width: '100%'}} />
                        </Box>
                    ) : (
                        <>
                            <DialogContentText>
                                Please enter a name for your flashcard collection.
                            </DialogContentText>
                            <TextField autoFocus margin="dense" label="Collection Name" type="text" fullWidth value={name} onChange={(e) => setName(e.target.value)} variant="outlined" />
                        </>
                    )}

                </DialogContent>
                {!isLoading && (
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={saveFlashcards}>Save</Button>
                    </DialogActions>
                )}
            </Dialog>

        </Container>
    )

}