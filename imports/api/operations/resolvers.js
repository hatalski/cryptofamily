import { withFilter } from 'graphql-subscriptions'; // will narrow down the changes subscriptions listen to
import { pubsubRedis } from '../subscriptions';
import TradeOperations from './operations';

const resolvers = {
  Query: {
    operations() {
      return TradeOperations.find({}).fetch();
    },
  },
  Mutation: {
    createTradeOperation(obj, args, context) {
      TradeOperations.insert({});
      pubsubRedis.publish('tradeOperationCreated', {
        tradeOperationCreated: args,
      });
    },
  },
  Subscription: {
    tradeOperationCreated: {
      subscribe: withFilter(
        () => pubsubRedis.asyncIterator('tradeOperationCreated'),
        (payload, args) =>
          payload.tradeOperationCreated.exchange === args.exchange &&
          payload.tradeOperationCreated.exchangeInternalId === args.exchangeInternalId,
      ),
    },
  },
};
