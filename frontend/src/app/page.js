'use client';

import Box from "@mui/material/Box";
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react';
import RigCard from "@/components/RigCard";
import { Typography } from "@mui/material";

export const GET_ALL_RIGS = gql`
  query GetAllRigs {
    allRigs {
      id
      title
      description
      imageUrl
    }
  }
`;

export default function Homepage() {
  const {data, loading, error} = useQuery(GET_ALL_RIGS);

  if (loading) {
    return <Typography>Loading rigs...</Typography>
  }

  if (error) {
    return <Typography>Error loading rigs: {error.message}</Typography>
  }

  return (
    <Box sx={{p: 4}}>
      <h1>All Rigs:</h1>
      {data.allRigs.map(rig => (
        <RigCard key={rig.id} rig={rig}/>
      ))}
    </Box>
  )
}