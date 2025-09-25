import {List, ListItem, ListItemText, Divider, Typography, dividerClasses} from '@mui/material';
import React from 'react';

export default function CommentList({comments}) {
    if (!comments || comments.length === 0) {
        return <Typography>No comments yet.</Typography>
    }

    return (
        <List>
            {comments.map((comment, index) => (
                <div key={comment.id}>
                    <ListItem >
                        <ListItemText primary={comment.text} secondary={`--- ${comment.author.username}`}/>
                    </ListItem>
                    {index < comments.length - 1 && <Divider component="li" />}
                </div>
            ))}
        </List>
    );
}