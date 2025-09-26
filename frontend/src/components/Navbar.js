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
                <Typography variant="h5" sx={{flexGrow: 1}}>
                    <Link href="/" style={{textDecoration: 'none', color: 'inherit'}}>
                        Project Rigs
                    </Link>
                </Typography>

                <Link href="/rigs/newrig" passHref>
                    <Button variant="outlined" color="secondary" sx={{marginInlineEnd: '32px'}}>Create a new Rig</Button>
                </Link>

                <Box>
                    <Link href="/login" passHref>
                        <Button variant="outlined" color="secondary" sx={{marginRight: '8px'}}>Login</Button>
                    </Link>
                    <Link href="/register" passHref>
                        <Button variant="outlined" color="secondary">Register</Button>
                    </Link>
                </Box>
            </Toolbar>
        </AppBar>
    );
}