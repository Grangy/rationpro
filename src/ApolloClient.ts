import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://ration.phys.su/graphql',  // Укажите URL вашего GraphQL сервера
  }),
  cache: new InMemoryCache()
});




export default client;