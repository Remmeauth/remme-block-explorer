import React from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const PrivateRoute = ({component: Component, ...rest}) => (
  <Route {...rest} render={props => (
    rest.SwapInitiated ? (
      <Component {...props} />
    ) : (
      <Redirect
        to={{
          pathname: '/init-swap',
          state: {from: props.location}
        }}
      />
    ))
  }/>
);

//----------------------------------------------------------------------------------------------------------------------

PrivateRoute.propTypes = {
  SwapInitiated: PropTypes.bool.isRequired
};

//----------------------------------------------------------------------------------------------------------------------

const mapStateToProps = state => ({
  SwapInitiated: state.auth.SwapInitiated
});

//----------------------------------------------------------------------------------------------------------------------

export default withRouter(connect(mapStateToProps)(PrivateRoute));
