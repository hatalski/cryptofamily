import React, { Component } from 'react';
import { Accounts } from 'meteor/accounts-base';

export default class RegisterForm extends Component {
    registerUser = (e) => {
      e.preventDefault();
      Accounts.createUser(
        {
          username: this.username.value,
          password: this.password.value,
        },
        (error) => {
          if (!error) {
            this.props.client.resetStore();
          }
          console.log(error); // eslint-disable-line no-console
        },
      );
    }
    render() {
      return (
        <form onSubmit={this.registerUser}>
          <input type="text" name="username" ref={input => (this.username = input)} />
          <input type="password" ref={input => (this.password = input)} />
          <button type="submit">Register User</button>
        </form>
      );
    }
}
