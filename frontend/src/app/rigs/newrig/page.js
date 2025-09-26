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
    const [rigData, setRigData] = useState({title: '', description: ''});
    const [imageFile, setImageFile] = useState(null);
    const router = useRouter();

    const onChangeRig = (e) => {
        setRigData({
            ...rigData,
            [e.target.name]: e.target.value
        });
    }

    const onChangeImg = (e) => {
        setImageFile(e.target.files[0]);
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

        if (!imageFile) {
            alert("Please upload an image.");
            return;
        }

        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: 'POST',
                    body: formData
                }
            );

            const cloudinaryData = await response.json();
            const imageUrl = cloudinaryData.secure_url;

            const result = await createNewRig({
                variables: {
                    title: rigData.title,
                    description: rigData.description,
                    imageUrl: imageUrl
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
            <TextField label="Title:" name="title" value={rigData.title} onChange={onChangeRig} required/>
            <TextField label="Description (optional):" name="description" value={rigData.description} onChange={onChangeRig}/>
            <Button variant='outlined' component="label">Upload Image <input type="file" hidden onChange={onChangeImg}/></Button>
            {imageFile && <Typography>{imageFile.name}</Typography>}
            {loading ? <Button type="submit" variant="contained" sx={{height: '50px'}} disabled>Submitting...</Button> : <Button type="submit" variant="contained" onSubmit={onSubmitFunc} sx={{height: '50px'}}>Submit</Button>}
            {error && (
                <Typography color="error">Error: {error.message}</Typography>
            )}
        </Box>
    );
}