import { withFilter } from "graphql-subscriptions"; // will narrow down the changes subscriptions listen to
import { pubsub, pubsubRedis } from "../subscriptions"; // import pubsub object for subscriptions to work

import Transactions from "./transactions";

const resolvers = {
  Query: {
    transactions(obj, args, context) {
      console.log("get transactions");
      // const transactions = [
      //     { id: "txid1", timestamp: "234454353", addressFrom: "te", addressTo: "to" },
      //     { id: "txid2", timestamp:"1234454353", addressFrom: "yelo", addressTo: "helo" },
      // ];
      const transactions = Transactions.find({}).fetch();
      return transactions;
    }
  },

  Mutation: {
    createTransaction(obj, args, context) {
      args.id = Transactions.insert({
        createdAt: Date.now(),
        updatedAt: Date.now(),
        transactionId: args.transactionId,
        timestamp: args.timestamp,
        symbol: args.symbol,
        addressFrom: args.addressFrom,
        addressTo: args.addressTo,
        amount: args.amount,
        fee: args.fee,
        status: args.status,
        type: args.type
      });

      pubsubRedis.publish("transactionCreated", {
        transactionAdded: { id: args.id }
      });

      return args;
    }
  },

  Subscription: {
    transactionCreated: {
      subscribe: withFilter(
        () => pubsubRedis.asyncIterator("transactionCreated"),
        (payload, args) => {
          return (payload.transactionCreated.id === args.id);
        }
      )
    }
  }
};

export default resolvers;
