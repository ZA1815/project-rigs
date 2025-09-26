'use client';

import RigCard from "@/components/RigCard";
import CommentsList from "@/components/CommentsList";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import React, { useState } from "react";
import { Box, Typography, Grid } from "@mui/material";
import { useRouter } from "next/navigation";
import Link from "next/link";

export const GET_RIGS_BY_AUTHOR = gql`
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
            <Typography variant='h4' gutterBottom sx={{alignSelf: 'center', mb: 10}}>Rigs by: {username}</Typography>
            <Grid container spacing={10} sx={{maxWidth: 2400, ml: 50}}>
                {data.rigsByAuthor.map(rig => (
                    <Grid item key={rig.id} xs={12} sm={6} md={4}>
                        <Link href={`rigs/${rig.id}`} key={rig.id} style={{textDecoration: 'none'}}>
                            <RigCard rig={rig}/>
                        </Link>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}