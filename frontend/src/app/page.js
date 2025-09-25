'use client';

import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react';
import RigCard from "@/components/RigCard";
import { Typography, Box } from "@mui/material";
import Link from 'next/link';

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
        <Link href={`rigs/${rig.id}`} key={rig.id} style={{textDecoration: 'none'}}>
          <RigCard rig={rig}/>
        </Link>
      ))}
    </Box>
  )
}