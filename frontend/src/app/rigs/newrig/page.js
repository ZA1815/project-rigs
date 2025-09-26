'use client';

import { jwtDecode } from 'jwt-decode';
import { useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, TextField, Typography} from "@mui/material";
import {GET_ALL_RIGS} from "@/app/page"
import {GET_RIGS_BY_AUTHOR} from "@/app/users/[username]/page"

const NEW_RIG_MUTATION = gql`
    mutation CreateRig($title: String!, $description: String, $imageUrl: String!) {
        createRig(title: $title, description: $description, imageUrl: $imageUrl) {
            rig {
                id
                author {
                    username
                }
            }
        }
    }
`;

export default function NewRigPage() {
    const [createNewRig, {data, loading, error}] = useMutation(NEW_RIG_MUTATION);
    const [rigData, setRigData] = useState({title: '', description: '', imageUrl: ''});
    const router = useRouter();

    const onChangeFunc = (e) => {
        setRigData({
            ...rigData,
            [e.target.name]: e.target.value
        });
    }

    const onSubmitFunc = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('authToken')
        let username = null;

        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                username = decodedToken.username;
            }
            catch (err) {
                console.error('Error decoding token:', err);
                router.push('/login');
                return;
            }
        }

        if (!username) {
            console.error('Username could not be found in token.');
            router.push('/login');
            return;
        }

        try {
            const result = await createNewRig({
                variables: {
                    title: rigData.title,
                    description: rigData.description,
                    imageUrl: rigData.imageUrl
                },
                refetchQueries: [
                    {
                        query: GET_ALL_RIGS
                    },
                    {
                        query: GET_RIGS_BY_AUTHOR,
                        variables: {
                            username: username
                        }
                    }
                ],
                awaitRefetchQueries: true
            });

            if (result.data) {
                router.push('/');
            }
        }
        catch (err) {
            if (err.message.includes('Authentication required')) {
                console.error('Authentication error: Token is invalid or expired.');
                localStorage.removeItem('authToken');
                router.push('/login');
            }
            else {
                console.error('An unexpected error occurred:', err);
            }
        }
    }

    return (
        <Box component="form" onSubmit={onSubmitFunc} sx={{p: 4, display: 'flex', flexDirection: 'column', gap: 2, width: '500px', margin: 'auto', alignItems: 'stretch'}}>
            <Typography variant="h3">Create a New Rig</Typography>
            <TextField label="Title:" name="title" value={rigData.title} onChange={onChangeFunc} required/>
            <TextField label="Description (optional):" name="description" value={rigData.description} onChange={onChangeFunc}/>
            <TextField label="Image URL:" name="imageUrl" value={rigData.imageUrl} onChange={onChangeFunc} required/>
            {loading ? <Button type="submit" variant="contained" sx={{height: '50px'}} disabled>Submitting...</Button> : <Button type="submit" variant="contained" onSubmit={onSubmitFunc} sx={{height: '50px'}}>Submit</Button>}
            {error && (
                <Typography color="error">Error: {error.message}</Typography>
            )}
        </Box>
    );
}