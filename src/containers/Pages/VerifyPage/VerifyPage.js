import React from 'react';
import Loader from '@iso/components/utility/loader';
import IntlMessages from '@iso/components/utility/intlMessages';
import VerifyPageWrapper from './VerifyPage.styles';
import { withRouter, useHistory } from 'react-router-dom';
import queryString from 'query-string';
import { userService } from '@iso/services';
import { useDispatch } from 'react-redux';
import authAction from '@iso/redux/auth/actions';
import appAction from '@iso/redux/app/actions';

const { login } = authAction;
const { clearMenu } = appAction;

const VerifyPage = (props) => {
  const [message, setMessage] = React.useState('');
  const token = queryString.parse(props.location.search).token || '';
  const property_id = queryString.parse(props.location.search).property_id || '';
  const dispatch = useDispatch();
  let history = useHistory();

  React.useEffect(() => {
    const data = {
      token,
      property_id
    }
    setTimeout(() => {
      userService.verifyEmail(data).then(res => {
        if(res.access_token){
          dispatch(login(res.access_token));
          dispatch(clearMenu());
          history.push('/dashboard');
        } else {
          if(res.code === '0000'){
            history.push('/dashboard');
          } else {
            setMessage(res.message);
          }
        }
      })
    }, 2000)
  });

  return (
    <VerifyPageWrapper>
      {
        message ?
        <h1>{message}</h1>
        :
        <>
          <Loader />
          <h1>
            {
              property_id ?
              <IntlMessages id="verifypage.inviteEmail.message" /> :
              <IntlMessages id="verifypage.email.message" />
            }
          </h1>
        </>
      }
      
    </VerifyPageWrapper>
  );
}

export default withRouter(VerifyPage);
