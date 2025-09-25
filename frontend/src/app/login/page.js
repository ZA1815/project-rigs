'use client';

import { useMutation } from "@apollo/client/react"
import { gql } from "@apollo/client"
import { Box, Button, TextField, Typography} from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/navigation";

const LOGIN_MUTATION = gql`
    mutation TokenAuth($username: String!, $password: String!) {
        tokenAuth(username: $username, password: $password) {
            token
        }
    }
`;

export default function LoginPage() {
    const [loginUser, {data, loading, error}] = useMutation(LOGIN_MUTATION);
    const [userData, setUserData] = useState({username: '', password: ''});
    const router = useRouter();

    const onChangeFunc = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        })
    }

    const onSubmitFunc = async (e) => {
        e.preventDefault();

        try {
            const result = await loginUser({
                variables: {
                    username: userData.username,
                    password: userData.password
                }
            });

            if (result.data?.tokenAuth?.token) {
                const token = result.data.tokenAuth.token;

                console.log("Login successful. Token:", token);

                localStorage.setItem('authToken', token);

                router.push('/');
            }
        }
        catch (err) {
            console.error("Login mutation failed", err);
        }
    }
    
    return (
        <Box component="form" onSubmit={onSubmitFunc} sx={{display: 'flex', flexDirection: 'column', gap: 2, width: '300px', margin: 'auto'}}>
            <Typography variant="h3">Login</Typography>
            <TextField label="Username:" name="username" value={userData.username} onChange={onChangeFunc} required/>
            <TextField label="Password:" type="password" name="password" value={userData.password} onChange={onChangeFunc} required/>
            {loading ? <Button type="submit" variant="contained" disabled>Submitting...</Button> : <Button type="submit" variant="contained" onSubmit={onSubmitFunc}>Submit</Button>}
            {error && (
                <Typography color="error">Error: {error.message}</Typography>
            )}
        </Box>
    );
}