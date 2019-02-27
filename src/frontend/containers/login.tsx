import React from 'react';
import {
  typedConnect,
  createPropsMapper,
  PropsOf
} from 'react-redux-typed-connect';
import {
  Alert,
  Button,
  FormGroup,
  FormControl,
  ButtonToolbar,
  Panel,
  Well
} from 'react-bootstrap';
import {css} from 'emotion';

import {i18nSelector} from '../actions/locale';
import {
  actions as authActions, 
  loginResultSelector,
} from '../actions/auth';
import {RootState} from '../reducers';

const loginCss = {
  'max-width': '250px',
  width: '80%',
  margin: 'auto',
  'padding-top': '10px',
};

const loginButtonCss = {
  width: '100%'
};

type Props = PropsOf<typeof propsMapper>;
interface LoginState {
  email: string;
  password: string;
}
class Login extends React.Component<Props, LoginState> {
  constructor(props:Props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }
  render() {
    const {loginResult,i18n} = this.props;

    return (
      <div className={css(loginCss)}>
        <Panel>
          <Panel.Heading>
            {i18n.gettext('Sign In')}
          </Panel.Heading>
          <Panel.Body>
            <FormGroup>
              <FormControl type="text" value={this.state.email} 
                autoCapitalize="none" autoCorrect="off" 
                placeholder={i18n.gettext('Email')} 
                onChange={(e:React.FormEvent<FormControl>) => this.setState({
                  ...this.state,
                  email: (e.target as any).value
                })}/>
            </FormGroup>
            <FormGroup>
              <FormControl type="password" value={this.state.password} 
                placeholder={i18n.gettext('Password')} 
                onChange={(e:React.FormEvent<FormControl>) => this.setState({
                  ...this.state,
                  password: (e.target as any).value
                })}/>
            </FormGroup> 
            <ButtonToolbar>
              <Button className={css(loginButtonCss)} bsStyle='primary'
                onClick={() => this.props.login({
                  email: this.state.email,
                  password: this.state.password,
                  jwt: false
                })}>
                {i18n.gettext('Sign In')}
              </Button>
            </ButtonToolbar>
            {loginResult && <Well><Alert bsStyle="danger">{loginResult}</Alert></Well>}
          </Panel.Body>
        </Panel>
      </div>
    );
  }
}
const propsMapper = createPropsMapper({
  fromState: (state:RootState) => ({
    i18n: i18nSelector(state),
    loginResult: loginResultSelector(state)
  }),
  actions: () => ({
    login: authActions.login
  })
});

export default typedConnect(propsMapper)(Login);
