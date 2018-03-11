import { withFilter } from 'graphql-subscriptions'; // will narrow down the changes subscriptions listen to
import { pubsub, pubsubRedis } from './subscriptions'; // import pubsub object for subscriptions to work
import { Accounts, Transactions, TradeOperations } from './collections'; // Meteor-specific for doing database queries

const resolvers = {

    Query: {
        account(obj, args, context) {
            console.log('get account query');
            console.log(args);
            const account = Accounts.findOne({ _id: args.id });
            if (account) {
                // Mongo stores id as _id, but our GraphQL API calls for id, so make it conform to the API
                account.id = account._id;
                delete account._id;
            }
            return account;
        }
    },

    Mutation: {
        createAccount(obj, args, context) {
            // You'll probably want to validate the args first in production, and possibly check user credentials using context
            args.id = Accounts.insert({ publicKey: args.publicKey, hashedPassword: args.hashedPassword });
            pubsubRedis.publish("accountCreated", { accountCreated: { id: args.id } }); // trigger a change to all subscriptions to this person
            // Note: You must publish the object with the subscription name nested in the object!
            // See: https://github.com/apollographql/graphql-subscriptions/issues/51
            return args;
        },
        addTransaction(obj, args, context) {
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

            pubsubRedis.publish("transactionAdded", { transactionAdded: { id: args.id } });

            return args;
        }
    },

    Subscription: {
        accountCreated: {
            // See: https://github.com/apollographql/graphql-subscriptions#channels-mapping
            // Take a look at "Channels Mapping" for handling multiple create, update, delete events
            // Also, check out "PubSub Implementations" for using Redis instead of PubSub
            // PubSub is not recommended for production because it won't work if you have multiple servers
            // withFilter makes it so you can only listen to changes to this person instead of all people
            subscribe: withFilter(() => pubsubRedis.asyncIterator('accountCreated'), (payload, args) => {
                return payload.accountCreated;
            })
        },
        transactionAdded: {
            subscribe: withFilter(() => pubsubRedis.asyncIterator('transactionAdded'), (payload, args) => {
                return payload.transactionAdded.transactionId;
            })
        }
    }

};

export default resolvers;