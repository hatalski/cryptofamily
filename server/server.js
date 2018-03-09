import { createApolloServer, addCurrentUserToContext } from 'meteor/apollo';
import { makeExecutableSchema } from 'graphql-tools';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { WebApp } from 'meteor/webapp'; // Meteor-specific
import { execute, subscribe } from 'graphql';

import typeDefs from '/imports/api/schema.graphql';
import resolvers from '/imports/api/resolvers';

const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

createApolloServer({
    schema,
});

// create subscription server
// non-Meteor implementation here: https://github.com/apollographql/subscriptions-transport-ws
new SubscriptionServer({
    schema,
    execute,
    subscribe,
    // // on connect subscription lifecycle event
    // onConnect: async (connectionParams, webSocket) => {
    //   // if a meteor login token is passed to the connection params from the client, 
    //   // add the current user to the subscription context
    //   const subscriptionContext = connectionParams.authToken
    //     ? await addCurrentUserToContext(context, connectionParams.authToken)
    //     : context;
    //   return subscriptionContext;
    // }
}, {
    server: WebApp.httpServer,
    path: '/subscriptions'
});