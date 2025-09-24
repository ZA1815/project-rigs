'use client';
import {ApolloProvider} from "@apollo/client/react";
import client from "@/lib/ApolloClient";
import ThemeRegistry from "@/ThemeRegistry";

export default function Providers({children}) {
    return (
        <ApolloProvider client={client}>
            <ThemeRegistry>
                {children}
            </ThemeRegistry>
        </ApolloProvider>
    );
}