import React, { Component } from 'react';

export default class LoginForm extends Component {
  login = (e) => {
    e.preventDefault();
    Meteor.loginWithPassword(this.username.value, this.password.value, (error) => {
      if (!error) {
        this.props.client.resetStore();
      }
      console.log(error); // eslint-disable-line no-console
    });
  };
  render() {
    return (
      <form onSubmit={this.login}>
        <input type="username" ref={input => (this.username = input)} />
        <input type="password" ref={input => (this.password = input)} />
        <button type="submit">Login User</button>
      </form>
    );
  }
}
