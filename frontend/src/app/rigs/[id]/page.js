'use client';

import RigCard from "@/components/RigCard";
import CommentsList from "@/components/CommentsList";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import React, { useState } from "react";
import { Box, Typography, TextField, Button, Rating } from "@mui/material";
import { useRouter } from "next/navigation";
import Link from "next/link";

const GET_RIG_BY_ID = gql`
    query GetRigById($rigId: ID!) {
        rigById(id: $rigId) {
            title
            description
            imageUrl
            createdAt
            author {
                username
            }
            comments {
                id
                text
                author {
                    username
                }
            }
            averageRating
        }
    }
`;

const COMMENT_MUTATION = gql`
    mutation CreateComment($text: String!, $rigId: ID!) {
        createComment(text: $text, rigId: $rigId) {
            comment {
                id
                text
                author {
                    username
                }
            }
        }
    }
`;

const RATING_MUTATION = gql`
    mutation SubmitRating($rigId: ID!, $rating: Int!) {
        submitRating(rigId: $rigId, rating: $rating) {
            rig {
                id
                averageRating
            }
        }
    }
`;

export default function RigDetailPage({params}) {
    const unrappedParams = React.use(params);
    const rigId = unrappedParams.id;
    const [commentText, setCommentText] = useState('');
    const [rating, setRating] = useState(0);
    const router = useRouter();

    const {data: dataRig, loading: loadingRig, error: errorRig} = useQuery(GET_RIG_BY_ID, {
        variables: {
            rigId: rigId
        }
    });

    const [createComment, {loading: loadingComment, error: errorComment}] = useMutation(COMMENT_MUTATION, {
        refetchQueries: [
            {
                query: GET_RIG_BY_ID,
                variables: {
                    rigId
                }
            }
        ],
        awaitRefetchQueries: true
    });

    const [submitRating, {loading: loadingRating, error: errorRating}] = useMutation(RATING_MUTATION, {
        refetchQueries: [
            {
                query: GET_RIG_BY_ID,
                variables: {
                    rigId
                }
            },
        ],
        awaitRefetchQueries: true
    })

    const onChangeComment = (e) => {
        setCommentText(e.target.value);
    }

    const onChangeRating = async (e, newValue) => {
        setRating(newValue);
        
        try {
            const response = await submitRating({
                variables: {
                    rigId: rigId,
                    rating: newValue
                }
            });
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

    const onSubmitFunc = async (e) => {
        e.preventDefault();
        try {
            const response = await createComment({
                variables: {
                    text: commentText,
                    rigId: rigId
                }
            });
            
            setCommentText('');
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


    if (loadingRig) {
        return <Typography>Loading rig...</Typography>
    }

    if (errorRig) {
        return <Typography>Error loading rig: {error.message}</Typography>
    }

    if (!dataRig?.rigById) {
        return <Typography>Rig not found.</Typography>
    }

    return (
        <Box sx={{p: 4}}>
            <Link href={`/users/${dataRig.rigById.author.username}`}>
                <Typography variant="h3">Posted by: {dataRig.rigById.author.username}</Typography>
            </Link>
            <RigCard key={rigId} rig={dataRig.rigById}/>
            <Typography variant="h5">Rate:</Typography>
            <Rating name="simple-controlled" value={rating} onChange={onChangeRating}/>
            <Typography>Average Rating: {dataRig.rigById.averageRating}</Typography>
            <CommentsList comments={dataRig.rigById.comments}/>
            <Box component="form" onSubmit={onSubmitFunc} sx={{display: 'flex', flexDirection: 'column', gap: 2, width: '300px', margin: 'auto'}}>
                <Typography variant="h3">Add a comment:</Typography>
                <TextField label="Text:" value={commentText} onChange={onChangeComment} required/>
                {loadingComment ? <Button type="submit" variant="contained" disabled>Submitting...</Button> : <Button type="submit" variant="contained">Submit</Button>}
                {errorComment && (
                    <Typography color="error">Error: {errorComment.message}</Typography>
                )}
            </Box>
        </Box>
    );
}