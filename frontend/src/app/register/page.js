'use client';

import { useMutation } from "@apollo/client/react"
import { gql } from "@apollo/client"
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { Typography } from "@mui/material";
import { useRouter } from "next/navigation";

const REGISTER_MUTATION = gql`
    mutation CreateUser($username: String!, $email: String!, $password: String!) {
        createUser(username: $username, email: $email, password: $password) {
            token
        }
    }
`;

export default function RegisterPage() {
    const [registerUser, {data, loading, error}] = useMutation(REGISTER_MUTATION);
    const [userData, setUserData] = useState({username: '', email:'', password: ''});
    const router = useRouter();

    const onChangeFunc = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        });
    }

    const onSubmitFunc = async (e) => {
        e.preventDefault()

        try {
            const result = await registerUser({
                variables: {
                    username: userData.username,
                    email: userData.email,
                    password: userData.password
                }
            });

            if (result.data?.createUser?.token) {
                const token = result.data.createUser.token;

                console.log('Login successful. Token:', token);

                localStorage.setItem('authToken', token);

                router.push('/');
            }
        }
        catch (err) {
            console.error('Login mutation failed:', err)
        }
    }
    
    return (
        <Box component="form" onSubmit={onSubmitFunc} sx={{p: 4, display: 'flex', flexDirection: 'column', gap: 2, width: '500px', margin: 'auto', alignItems: 'stretch'}}>
            <Typography variant="h3">Register</Typography>
            <TextField label="Username:" name="username" value={userData.username} onChange={onChangeFunc} required/>
            <TextField label="Email:" name="email" value={userData.email} onChange={onChangeFunc} required/>
            <TextField label="Password:" type="password" name="password" value={userData.password} onChange={onChangeFunc} required/>
            {loading ? <Button type="submit" variant="contained" sx={{height: '50px'}} disabled>Submitting...</Button> : <Button type="submit" variant="contained" onSubmit={onSubmitFunc} sx={{height: '50px'}}>Submit</Button>}
            {error && (
                <Typography color="error">Error: {error.message}</Typography>
            )}
        </Box>
    );
}