// file version 0.2

import { createApolloServer, addCurrentUserToContext } from 'meteor/apollo';
import { WebApp } from 'meteor/webapp'; // Meteor-specific
import { makeExecutableSchema } from 'graphql-tools';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';
import { importSchema } from 'graphql-import';
import merge from 'lodash/merge';

import AccountsSchema from '../../api/schema/Account.graphql';
import OperationsSchema from '../../api/schema/TradeOperation.graphql';
import TransactionsSchema from '../../api/schema/Transaction.graphql';
import AccountsResolvers from '../../api/accounts/resolvers';
import OperationsResolvers from '../../api/operations/resolvers';
import TransactionsResolvers from '../../api/transactions/resolvers';

// const typeDefsImport = importSchema('../../api/schema/Account.graphql');
// console.log(typeDefsImport); // eslint-disable-line no-console

const typeDefs = [AccountsSchema, OperationsSchema, TransactionsSchema];
const resolvers = merge(AccountsResolvers, OperationsResolvers, TransactionsResolvers);

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

createApolloServer({
  schema,
});

// create subscription server
// non-Meteor implementation here: https://github.com/apollographql/subscriptions-transport-ws
const subServer = new SubscriptionServer(
  {
    schema,
    execute,
    subscribe,
    // on connect subscription lifecycle event
    onConnect: async (connectionParams, webSocket) => {
      // if a meteor login token is passed to the connection params from the client,
      // add the current user to the subscription context
      const subscriptionContext = connectionParams.authToken
        ? await addCurrentUserToContext(context, connectionParams.authToken)
        : context;
      return subscriptionContext;
    },
  },
  {
    server: WebApp.httpServer,
    path: '/subscriptions',
  },
);
