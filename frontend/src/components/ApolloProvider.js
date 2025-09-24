'use client';
import {ApolloProvider as Provider} from '@apollo/client';
import client from '@/lib/ApolloClient';

export default function ApolloProvider({children}) {
    return <Provider client={client}>{children}</Provider>;
}