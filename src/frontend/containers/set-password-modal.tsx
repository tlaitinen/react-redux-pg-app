import React from 'react';
import {
  Modal,
  Form,
  Button,
  ButtonToolbar,
  FormControl
} from 'react-bootstrap';
import {
  typedConnect, createPropsMapper, PropsOf
} from 'react-redux-typed-connect';
import FontAwesome from '../components/font-awesome';
import {actions as uiActions} from '../actions/ui';
import {RootState} from '../reducers';
import {i18nSelector} from '../actions/locale';
import {userSelector} from '../actions/auth';
import {actions as requestsActions} from '../actions/requests';
import HFormGroupControl from '../components/h-form-group-control';
type Props = PropsOf<typeof propsMapper>;
interface State {
  password: string;
  passwordAgain: string;
}
class SetPasswordModal extends React.Component<Props, State> {
  constructor(props:Props) {
    super(props);
    this.state = {
      password: '',
      passwordAgain: ''
    };
  }
  render() {

    const {hideModal, user, i18n} = this.props;
    const {password, passwordAgain} = this.state;
    if (!user) {
      return null;
    }
    return (
      <Modal show={true} onHide={hideModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {i18n.gettext('Set Password')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form horizontal>
            <HFormGroupControl 
              title={i18n.gettext('Password')}
              type='password'
              value={password}
              onChange={(e:React.FormEvent<FormControl>) => {
                this.setState({
                  ...this.state,
                  password: (e.target as any).value
                });
              }}/>
            <HFormGroupControl 
              title={i18n.gettext('Password Again')}
              type='password'
              value={passwordAgain}
              onChange={(e:React.FormEvent<FormControl>) => {
                this.setState({
                  ...this.state,
                  passwordAgain: (e.target as any).value
                });
              }}/>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <ButtonToolbar>
            <Button disabled={password.length == 0 || password !== passwordAgain}
                bsStyle='primary'
                onClick={() => {
                  this.props.request({
                    request: {
                      type: 'set-password',
                      props: {
                        userId: user.id, 
                        password
                      }
                    },
                    loadingMask: true
                  });
                  hideModal();
                }}>
              <FontAwesome fa='key' nbsp={true}/>
              {i18n.gettext('Set Password')}
            </Button>
            <Button onClick={hideModal}>
              {i18n.gettext('Cancel')}
            </Button>
          </ButtonToolbar>
        </Modal.Footer>
      </Modal>
    );
   
  }
}

const propsMapper = createPropsMapper({
  fromState: (state:RootState) => {

    const user =  userSelector(state);
    return {
      user,
      i18n: i18nSelector(state)
    }
  },
  actions: () => ({
    hideModal: uiActions.hideModal,
    request: requestsActions.request
  })
});
export default typedConnect(propsMapper)(SetPasswordModal);
