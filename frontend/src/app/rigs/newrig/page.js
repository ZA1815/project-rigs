'use client';

import { useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, TextField, Typography} from "@mui/material";
import {GET_ALL_RIGS} from "@/app/page"

const NEW_RIG_MUTATION = gql`
    mutation CreateRig($title: String!, $description: String, $imageUrl: String!) {
        createRig(title: $title, description: $description, imageUrl: $imageUrl) {
            rig {
                id
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

        try {
            const result = await createNewRig({
                variables: {
                    title: rigData.title,
                    description: rigData.description,
                    imageUrl: rigData.imageUrl
                },
                refetchQueries: [
                    { query: GET_ALL_RIGS }
                ]
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
        <Box component="form" onSubmit={onSubmitFunc} sx={{display: 'flex', flexDirection: 'column', gap: 2, width: '300px', margin: 'auto'}}>
            <Typography variant="h3">Create a new Rig</Typography>
            <TextField label="Title:" name="title" value={rigData.title} onChange={onChangeFunc} required/>
            <TextField label="Description (optional):" name="description" value={rigData.description} onChange={onChangeFunc}/>
            <TextField label="Image URL:" name="imageUrl" value={rigData.imageUrl} onChange={onChangeFunc} required/>
            {loading ? <Button type="submit" variant="contained" disabled>Submitting...</Button> : <Button type="submit" variant="contained" onSubmit={onSubmitFunc}>Submit</Button>}
            {error && (
                <Typography color="error">Error: {error.message}</Typography>
            )}
        </Box>
    );
}