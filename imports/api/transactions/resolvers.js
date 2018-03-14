import { withFilter } from 'graphql-subscriptions'; // will narrow down the changes subscriptions listen to
import { pubsubRedis } from '../subscriptions'; // import pubsub object for subscriptions to work

import Transactions from './transactions';

const resolvers = {
  Query: {
    transactions(obj, args, { userId }) {
      return Transactions.find({
        userId,
      }).fetch();
    },
  },

  Mutation: {
    createTransaction(obj, args, { userId }) {
      const newTransactionId = Transactions.insert({
        // createdAt: Date.now(),
        // updatedAt: Date.now(),
        // transactionId: args.transactionId,
        // timestamp: args.timestamp,
        symbol: args.symbol,
        // addressFrom: args.addressFrom,
        // addressTo: args.addressTo,
        amount: args.amount,
        userId,
        // fee: args.fee,
        // status: args.status,
        // type: args.type
      });

      const newTransaction = Transactions.findOne(newTransactionId);

      pubsubRedis.publish('transactionCreated', {
        transactionAdded: { transactionId: newTransaction._id },
      });

      return newTransaction;
    },
  },

  Subscription: {
    transactionCreated: {
      subscribe: withFilter(
        () => pubsubRedis.asyncIterator('transactionCreated'),
        (payload, args) => payload.transactionCreated.id === args.transactionId,
      ),
    },
  },
};

export default resolvers;
