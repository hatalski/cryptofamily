import { withFilter } from "graphql-subscriptions"; // will narrow down the changes subscriptions listen to
import { pubsub, pubsubRedis } from "../subscriptions"; // import pubsub object for subscriptions to work

import Transactions from "./transactions";

const resolvers = {
  Query: {
    transactions(obj, args, context) {
      console.log("get transactions");
      const transactions = Transactions.find({}).fetch();
      console.log(transactions);
      return transactions;
    }
  },

  Mutation: {
    createTransaction(obj, args, context) {
      console.log("server create transaction mutation");
      const newTransactionId = Transactions.insert({
        //createdAt: Date.now(),
        //updatedAt: Date.now(),
        //transactionId: args.transactionId,
        //timestamp: args.timestamp,
        symbol: args.symbol,
        //addressFrom: args.addressFrom,
        //addressTo: args.addressTo,
        amount: args.amount,
        //fee: args.fee,
        //status: args.status,
        //type: args.type
      });

      const newTransaction = Transactions.findOne(newTransactionId);

      // pubsubRedis.publish("transactionCreated", {
      //   transactionAdded: { transaction: newTransaction }
      // });

      return newTransaction;
    }
  }//,

  // Subscription: {
  //   transactionCreated: {
  //     subscribe: withFilter(
  //       () => pubsubRedis.asyncIterator("transactionCreated"),
  //       (payload, args) => {
  //         return payload.transactionCreated.id === args.transaction.id;
  //       }
  //     )
  //   }
  // }
};

export default resolvers;
