import gql from "graphql-tag";

export default gql`
    enum TransactionType {
        DEPOSIT, WITHDRAWAL
    }

    type Address {
        owner: Trader!
        address: String!
    }

    type Trader {
        nick: String!
    }

    type Transaction {
        _id: String!
        symbol: String!
        amount: Float!
        #trader: Trader
        #timestamp: String
        #transactionId: String
        #addressFrom: Address
        #addressTo: Address
        #fee: Float
        #status: String
        #type: TransactionType
    }

    input TransactionInput {
        #transactionId: String
        #timestamp: String
        symbol: String!
        #addressFrom: String 
        #addressTo: String
        amount: Float!
        #fee: Float
        #status: String
        #type: String
    }


    extend type Query {
        transaction: Transaction
        transactions: [Transaction]
    }

    extend type Mutation {
        createTransaction(symbol: String!, amount: Float!): Transaction
    }

    # extend type Subscription {
    #     transactionCreated(transaction: Transaction!): Transaction
    # }
`;