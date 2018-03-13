import React, { Component } from "react";
import gql from "graphql-tag";
import { graphql } from "react-apollo";

//import createTransaction from "../queries/createTransaction.graphql";

const createTransaction = gql`
  mutation createTransaction($symbol: String!, $amount: Float!) {
    createTransaction(symbol: $symbol, amount: $amount) {
      _id
      symbol
      amount
    }
  }
`;


class TransactionForm extends Component {
    submitForm = () => {
        this.props.createTransaction({
            variables: {
                symbol: this.symbol.value,
                amount: this.amount.value
            }
        }).then(({ data }) => {
            this.props.refetch();
        }).catch(error => {
            console.log(error);
        });
    }

    render() {  
        return (
          <div>
            <input type="text" ref={input => (this.symbol = input)} />
            <input type="text" ref={input => (this.amount = input)} />
            <button onClick={this.submitForm}>Create</button>
          </div>
        );
    }
}

export default graphql(createTransaction, {
  name: "createTransaction"
})(TransactionForm);