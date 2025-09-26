'use client';

import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react';
import RigCard from "@/components/RigCard";
import { Typography, Box, CircularProgress, Grid } from "@mui/material";
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
    return (
      <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh'}}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography sx={{p: 4}}>Error loading rigs: {error.message}</Typography>
  }

  return (
    <Box sx={{p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <Typography variant='h2' fontWeight='bold' gutterBottom sx={{alignSelf: 'center', mb: 6}}>All Rigs</Typography>
      <Grid container spacing={10} sx={{maxWidth: 2400, ml: 50}}>
        {data && data.allRigs.map(rig => (
          <Grid item key={rig.id} xs={12} sm={6} md={4}>
            <Link href={`rigs/${rig.id}`}  style={{textDecoration: 'none'}}>
              <RigCard rig={rig}/>
            </Link>
          </Grid>
      ))}
      </Grid>
    </Box>
  )
}