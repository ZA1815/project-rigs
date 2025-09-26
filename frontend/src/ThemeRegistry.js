'use client';
import * as react from 'react';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {AppRouterCacheProvider} from '@mui/material-nextjs/v13-appRouter';
import CssBaseline from '@mui/material/CssBaseline';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['300', '600'],
    display: 'swap'
})

const theme = createTheme({
    palette: {
        mode: 'dark'
    },
    typography: {
        fontFamily: poppins.style.fontFamily
    }
})

export default function ThemeRegistry({children}) {
    return (
        <AppRouterCacheProvider options={{enableCssLayer: true}}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </AppRouterCacheProvider>
    );
}