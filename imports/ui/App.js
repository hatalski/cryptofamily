import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import TransactionForm from './components/TransactionForm';

const App = ({ loading, transactions }) => {
  if (loading) return null;
  return (
    <div>
      <h1>Crypto Family Alpha</h1>
      <TransactionForm />
      <ul>
        {transactions.map(trx => (
          <li key={trx._id}>
            {trx.symbol} - {trx.amount}
          </li>
        ))}
      </ul>
    </div>
  );
};

const transactionsQuery = gql`
  query Transactions {
    transactions {
      _id
      symbol
      amount
    }
  }
`;

export default graphql(transactionsQuery, {
  props: ({ data }) => ({ ...data }),
})(App);
