import React from 'react';
import { graphql, withApollo } from 'react-apollo';
import gql from 'graphql-tag';

import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import TransactionForm from './components/TransactionForm';

const App = ({
  loading, transactions, client, user,
}) => {
  if (loading) return null;
  return (
    <div>
      <h1>Crypto Family Alpha</h1>
      {user._id ? (
        <div>
          <div>Current user: {user.username}</div>
          <button
            onClick={() => {
              Meteor.logout();
              client.resetStore();
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <div>
          <RegisterForm client={client} />
          <LoginForm client={client} />
        </div>
      )}

      <TransactionForm client={client} />

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
    user {
      _id
      username
    }
  }
`;

export default graphql(transactionsQuery, {
  props: ({ data }) => ({ ...data }),
})(withApollo(App));
