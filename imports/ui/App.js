import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import GET_ACCOUNT from '../graphql-queries/getAccount.graphql';
import GET_ACCOUNT_SUBSCRIPTION from '../graphql-queries/getAccountSubscription.graphql';
import CREATE_ACCOUNT from '../graphql-queries/createAccount.graphql';

const App = ({ data }) => (
    <div className="App">
        <div className="App-block">
            {data.loading
                ? <div>Loading...</div>
                : <div className="App-content">
                    <div>{console.log(data)}</div>
                    {data
                        ? <div>
                            <pre>{JSON.stringify(data, null, 2)}</pre>
                            <button onClick={() => refetch()}>Refetch the query!</button>
                        </div>
                        : 'Please log in!'}
                  </div>}
        </div>
    </div>
);

App.propTypes = {
    hasErrors: PropTypes.bool,
};

const withData = graphql(gql(GET_ACCOUNT), {
        options: (props) => ({
            variables: {
                id: "oGuwFj8uPeq3kECEa",
            },
        }),
    }
);

export default withData(App);