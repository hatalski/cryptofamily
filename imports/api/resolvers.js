import { withFilter } from 'graphql-subscriptions'; // will narrow down the changes subscriptions listen to
import { pubsub } from './subscriptions'; // import pubsub object for subscriptions to work
import { Accounts, Transactions, TradeOperations } from './collections'; // Meteor-specific for doing database queries

const resolvers = {

    Query: {
        account(obj, args, context) {
            const account = Accounts.findOne(args.id);
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
            pubsub.publish("accountCreated", { accountCreated: args }); // trigger a change to all subscriptions to this person
            // Note: You must publish the object with the subscription name nested in the object!
            // See: https://github.com/apollographql/graphql-subscriptions/issues/51
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
            subscribe: withFilter(() => pubsub.asyncIterator('accountCreated'), (payload, args) => {
                return (payload.accountCreated.publicKey === args.publicKey);
            })
        }
    }

};

export default resolvers;