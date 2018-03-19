import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

const createTransaction = gql`
  mutation createTransaction($transaction: TransactionInput!) {
    createTransaction(transaction: $transaction) {
      _id
      transactionId
      currency
      amount
      fee
      addressFrom
      addressTo
      timestamp
    }
  }
`;

class TransactionForm extends Component {
  submitForm = () => {
    this.props
      .createTransaction({
        variables: {
          transaction: {
            currency: this.currency.value,
            transactionId: this.transactionId.value,
            amount: this.amount.value,
            fee: this.fee.value,
            addressFrom: this.addressFrom.value,
            addressTo: this.addressTo.value,
            timestamp: this.timestamp.value,
          },
        },
      })
      .catch((error) => {
        console.warn(error); // eslint-disable-line no-console
      });
  };

  render() {
    return (
      <div>
        <input type="text" ref={input => (this.currency = input)} />
        <input type="text" ref={input => (this.transactionId = input)} />
        <input type="number" ref={input => (this.amount = input)} />
        <input type="number" ref={input => (this.fee = input)} />
        <input type="text" ref={input => (this.addressFrom = input)} />
        <input type="text" ref={input => (this.addressTo = input)} />
        <input type="datetime-local" ref={input => (this.timestamp = input)} />
        <button onClick={this.submitForm}>Create</button>
      </div>
    );
  }
}

export default graphql(createTransaction, {
  name: 'createTransaction',
  options: {
    refetchQueries: ['Transactions'],
  },
})(TransactionForm);
