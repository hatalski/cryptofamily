import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

// import ApolloClient from 'apollo-client';
// import { DDPLink } from 'meteor/swydo:ddp-apollo';
// import { ApolloLink } from 'apollo-link';
// import { HttpLink } from 'apollo-link-http';
// import { InMemoryCache } from 'apollo-cache-inmemory';
import { client } from './apolloClient';
import { ApolloProvider } from 'react-apollo';

import App from '../imports/ui/App.js';

// replaces createNetworkInterface
// const httpLink = new HttpLink({ uri: Meteor.absoluteUrl('graphql') });

// // replaces networkInterface.use([{ applyMiddleware .... 
// const authLink = new ApolloLink((operation, forward) => {
//   const token = Accounts._storedLoginToken(); // from local storagemete

//   operation.setContext(() => ({
//     headers: {
//       'meteor-login-token': token,
//     },
//   }));

//   return forward(operation);
// });

// const cache = new InMemoryCache();

// const client = new ApolloClient({
//   //link: new DDPLink(),
//   link: authLink.concat(httpLink),
//   cache,
// });

Meteor.startup(() => {
  render(
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>,
    document.getElementById('app')
  );
});