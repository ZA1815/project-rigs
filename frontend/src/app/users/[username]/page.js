'use client';

import RigCard from "@/components/RigCard";
import CommentsList from "@/components/CommentsList";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import React, { useState } from "react";
import { Box, Typography, TextField, Button, Rating } from "@mui/material";
import { useRouter } from "next/navigation";
import Link from "next/link";

const GET_RIGS_BY_AUTHOR = gql`
    query GetRigsByAuthor($username: String!) {
        rigsByAuthor(username: $username) {
            id
            title
            description
            imageUrl
            createdAt
            averageRating
        }
    }
`;

export default function UserDetailPage({params}) {
    const unrappedParams = React.use(params);
    const username = unrappedParams.username;

    const {data, loading, error} = useQuery(GET_RIGS_BY_AUTHOR, {
        variables: {
            username: username
        }
    });

    if (loading) {
        return <Typography>Loading rig...</Typography>
    }
    
    if (error) {
        return <Typography>Error loading rig: {error.message}</Typography>
    }
    
    if (!data?.rigsByAuthor) {
        return <Typography>Rig not found.</Typography>
    }

    return (
        <Box sx={{p: 4}}>
            <h1>Rigs By {username}:</h1>
            {data.rigsByAuthor.map(rig => (
                <Link href={`rigs/${rig.id}`} key={rig.id} style={{textDecoration: 'none'}}>
                    <RigCard rig={rig}/>
                </Link>
            ))}
        </Box>
    );
}