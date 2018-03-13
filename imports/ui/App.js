import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import TransactionForm from "./components/TransactionForm";

const App = ({ data }) => {
    if (data.loading) return null;
    
    return (
        <div>
            <h1>Crypto Family Alpha</h1>
            <TransactionForm refetch={data.refetch} />
            <ul>
            {data.transactions.map(trx => (
                <li key={trx._id}>{trx.symbol} - {trx.amount}</li>
            ))}
            </ul>
        </div>
    );
};

const getTransactions = gql`
    {
        transactions {
            _id
            symbol
            amount
        }
    }
`;

export default graphql(getTransactions)(App);