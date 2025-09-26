import {ApolloClient, InMemoryCache, HttpLink, ApolloLink} from '@apollo/client';
import {SetContextLink} from '@apollo/client/link/context';

const httpLink = new HttpLink({
    uri: 'https://project-rigs-backend.onrender.com'
});

const authLink = new SetContextLink((request, previousContext) => {
    if (typeof window === 'undefined') {
        return previousContext;
    }

    const token = localStorage.getItem('authToken');

    return {
        headers: {
            ...previousContext.headers,
            authorization: token ? `JWT ${token}` : ''
        }
    };
})

const client = new ApolloClient({
    link: ApolloLink.from([authLink, httpLink]),
    cache: new InMemoryCache()
});

export default client;