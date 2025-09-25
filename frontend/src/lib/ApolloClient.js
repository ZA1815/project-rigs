import {ApolloClient, InMemoryCache, HttpLink} from '@apollo/client';
import {SetContextLink} from '@apollo/client/link/context'

const httpLink = new HttpLink({
    uri: 'http://localhost:8000/graphql'
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
    link: from([authLink, httpLink]),
    cache: new InMemoryCache()
});

export default client;