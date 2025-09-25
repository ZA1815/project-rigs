'use client';

import RigCard from "@/components/RigCard";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import React from "react";
import { Box, Typography } from "@mui/material";

const GET_RIG_BY_ID = gql`
    query GetRigById($rigId: ID!) {
        rigById(id: $rigId) {
            title
            description
            imageUrl
            createdAt
        }
    }
`;

export default function RigDetailPage({params}) {
    const unrappedParams = React.use(params);
    const rigId = unrappedParams.id;

    const {data, loading, error} = useQuery(GET_RIG_BY_ID, {
        variables: {
            rigId: rigId
        }
    });

    if (loading) {
        return <Typography>Loading rig...</Typography>
    }

    if (error) {
        return <Typography>Error loading rig: {error.message}</Typography>
    }

    return (
        <Box sx={{p: 4}}>
            <RigCard key={rigId} rig={data.rigById}/>
        </Box>
    );
}