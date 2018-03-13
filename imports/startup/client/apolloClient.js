import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { getOperationAST } from 'graphql';

const httpUri = Meteor.absoluteUrl('graphql'); // http://localhost:3000/graphql
const wsUri = Meteor.absoluteUrl('subscriptions').replace(/^http/, 'ws'); // ws://localhost:3000/subscriptions

const link = ApolloLink.split(
  (operation) => {
    const operationAST = getOperationAST(operation.query, operation.operationName);
    return !!operationAST && operationAST.operation === 'subscription';
  },
  new WebSocketLink({
    uri: wsUri,
    options: {
      reconnect: true, // auto-reconnect
      connectionParams: {
        // getMeteorLoginToken = get the Meteor current user login token from local storage
        authToken: localStorage.getItem('Meteor.loginToken'),
      },
      // // carry login state (should use secure websockets (wss) when using this)
      // connectionParams: {
      //   authToken: localStorage.getItem("Meteor.loginToken")
      // }
    },
  }),
  new HttpLink({
    uri: httpUri,
    credentials: 'same-origin',
  }),
);

// const authLink = setContext((_, { headers }) => {
//     // get the authentication token from local storage if it exists
//     const token = localStorage.getItem('token');
//     // return the headers to the context so httpLink can read them
//     return {
//         headers: {
//             ...headers,
//             authorization: token ? `Bearer ${token}` : "",
//         }
//     }
// });

const cache = new InMemoryCache(window.__APOLLO_STATE);

export default client = new ApolloClient({
  link,
  cache,
});
