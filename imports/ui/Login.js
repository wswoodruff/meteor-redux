import React from 'react';
import PropTypes from 'prop-types';
import { Button, TextField, Tabs, Tab } from 'material-ui';
import BcryptJs from 'bcryptjs';
import { createUser, loginWithPassword } from 'meteor-apollo-accounts'
import AppolloClient from '/imports/startup/client/main';

import ApolloAccounts from 'meteor/nicolaslopezj:apollo-accounts';
import { initAccounts } from 'meteor/nicolaslopezj:apollo-accounts';

console.log('ApolloAccounts', ApolloAccounts);
console.log('initAccounts', initAccounts);

export default class Login extends React.Component {

  static propTypes = {
    signup: PropTypes.func.isRequired
  }

  defaultState = {
    email: '',
    password: '',
    confirmPassword: '',
    selectedTabIndex: 0,
    formErr: null
  };

  state = this.defaultState;

  onInputChange = ({ target: { name, value } }) => {
    this.setState({
      [name]: value
    });
  }

  onSubmit = () => {
    const { email, password, confirmPassword } = this.state;

    this.setState({
      formErr: null,
    },
    async () => {
      if (this.state.selectedTabIndex === 1 &&
          password !== confirmPassword) {
        return this.setState({
          formErr: new Error('Passwords don\'t match'),
        });
      }

      const profile = {
        name: email,
      };

      const response = await createUser({ username: email, email, password, profile }, AppolloClient);
      // const response = await this.props.signup({ email, password });
      console.log('signup response', response);
      return response;
    });
  }

  onTabsChange = (evt, value) => {
    this.setState({
      selectedTabIndex: value,
      formErr: null,
    });
  }

  render() {
    const { formErr, selectedTabIndex } = this.state;

    return (
      <div className="form-container">
        <Tabs value={selectedTabIndex} onChange={this.onTabsChange}>
          <Tab label="Login" />
          <Tab label="Signup" />
        </Tabs>

        <form className="form">
          <TextField
            name="email"
            label="Email"
            value={this.state.email}
            onChange={this.onInputChange}
            fullWidth
            required
          />
          <TextField
            name="password"
            label="Password"
            type="password"
            value={this.state.password}
            onChange={this.onInputChange}
            fullWidth
            required
          />
          {selectedTabIndex === 1 && (
            <TextField
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              value={this.state.confirmPassword}
              onChange={this.onInputChange}
              fullWidth
              required
            />
          )}
          {formErr && (
            <div className="error">{formErr.message}</div>
          )}
          <Button
            className="form-action"
            raised="true"
            color="primary"
            onClick={this.onSubmit}>{selectedTabIndex === 0 ? 'Login' : 'Signup'}</Button>
        </form>
      </div>
    );
  }
}