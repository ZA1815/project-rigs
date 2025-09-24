'use client';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from 'next/link';
import Button from '@mui/material/Button';

export default function Navbar() {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{flexGrow: 1}}>
                    <Link href="/" style={{textDecoration: 'none', color: 'inherit'}}>
                        Project Rigs
                    </Link>
                </Typography>

                <Box>
                    <Link href="/login" passHref>
                        <Button variant="outlined" color="inherit" sx={{marginRight: '8px'}}>Login</Button>
                    </Link>
                    <Link href="/register" passHref>
                        <Button variant="outlined" color="inherit">Register</Button>
                    </Link>
                </Box>
            </Toolbar>
        </AppBar>
    );
}