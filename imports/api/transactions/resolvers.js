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
    createTransaction(obj, { transaction }, { userId }) {
      check(transaction, {
        currency: String,
        amount: Number,
        transactionId: String,
        addressFrom: String,
        addressTo: String,
        fee: Number,
        timestamp: String, // no date type in graphql
      });
      check(userId, String);
      const newTransactionId = Transactions.insert({
        createdAt: Date.now(),
        updatedAt: Date.now(),
        transactionId: transaction.transactionId,
        timestamp: transaction.timestamp,
        currency: transaction.currency,
        addressFrom: transaction.addressFrom,
        addressTo: transaction.addressTo,
        amount: transaction.amount,
        fee: transaction.fee,
        userId,
        // status: args.status,
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
