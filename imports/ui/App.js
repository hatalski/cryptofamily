import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import GET_ACCOUNT from '../graphql-queries/getAccount.graphql';
import GET_ACCOUNT_SUBSCRIPTION from '../graphql-queries/getAccountSubscription.graphql';
import CREATE_ACCOUNT from '../graphql-queries/createAccount.graphql';

const App = ({ currentAccount, refetch, accountLoading }) => (
    <div className="App">
        <div className="App-block">
            {accountLoading
                ? <div>Loading...</div>
                : <div className="App-content">
                    <div>{currentAccount}</div>
                
                    <input type="text" value="" />
                    <input type="password" value="" />
                    {currentAccount
                        ? <div>
                            <pre>{JSON.stringify(currentAccount, null, 2)}</pre>
                            <button onClick={() => refetch()}>Refetch the query!</button>
                        </div>
                        : 'Please log in!'}
                  </div>}
        </div>
    </div>
);

App.propTypes = {
    currentAccount: PropTypes.object,
    hasErrors: PropTypes.bool,
    refetch: PropTypes.func,
    accountLoading: PropTypes.bool,
};

/*
 * We use the `graphql` higher order component to send the graphql query to our server
 * See for more information: http://dev.apollodata.com/react/
 */
const withData = graphql(gql(GET_ACCOUNT), {
        options: (props) => ({
            variables: {
                id: "oGuwFj8uPeq3kECEa",
            },
        }),
    }
    // destructure the default props to more explicit ones
    // props: ({ data: { error, loading, id, refetch } }) => {
    //     if (loading) return { accountLoading: true };
    //     if (error) return { hasErrors: true };
        
    //     return {
    //         currentAccount: account,
    //         refetch,
    //     };
    // },
);

export default withData(App);