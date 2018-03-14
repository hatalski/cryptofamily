import { Accounts } from 'meteor/accounts-base';
import { ApolloClient } from 'apollo-client';
import { ApolloLink, from } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { getOperationAST } from 'graphql';

const httpUri = Meteor.absoluteUrl('graphql'); // http://localhost:3000/graphql
const wsUri = Meteor.absoluteUrl('subscriptions').replace(/^http/, 'ws'); // ws://localhost:3000/subscriptions

const httpLink = new HttpLink({
  uri: httpUri,
});

const websocketLink = new WebSocketLink({
  uri: wsUri,
  options: {
    reconnect: true, // auto-reconnect
    connectionParams: {
      authToken: Accounts._storedLoginToken(),
    },
  },
});

const authLink = new ApolloLink((operation, forward) => {
  const token = Accounts._storedLoginToken();
  operation.setContext(() => ({
    headers: {
      'meteor-login-token': token,
    },
  }));
  return forward(operation);
});

const cache = new InMemoryCache(window.__APOLLO_STATE);

export default (client = new ApolloClient({
  link: from([authLink, httpLink]),
  cache,
}));

// const link = ApolloLink.split(
//   (operation) => {
//     const operationAST = getOperationAST(operation.query, operation.operationName);
//     return !!operationAST && operationAST.operation === 'subscription';
//   },
//   new WebSocketLink({
//     uri: wsUri,
//     options: {
//       reconnect: true, // auto-reconnect
//       connectionParams: {
//         authToken: localStorage.getItem('Meteor.loginToken'),
//       },
//     },
//   }),
//   new HttpLink({
//     uri: httpUri,
//     credentials: 'same-origin',
//   }),
// );
