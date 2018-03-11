import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import { client } from './apolloClient';
import { ApolloProvider } from 'react-apollo';

import App from '../../ui/App.js';

Meteor.startup(() => {
  render(
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>,
    document.getElementById('app')
  );
});