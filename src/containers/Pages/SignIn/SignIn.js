import React from 'react';
import { Link, Redirect, useHistory, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import IntlMessages from '@iso/components/utility/intlMessages';
import authAction from '@iso/redux/auth/actions';
import appAction from '@iso/redux/app/actions';
import userAction from '@iso/redux/user/actions';
import SignInStyleWrapper from './SignIn.styles';
import { Form, Input, Button } from 'antd';
import { userService } from '@iso/services';
import Alert from '@iso/components/Feedback/Alert';
import logo from '@iso/assets/images/logo.png';

const { login } = authAction;
const { clearMenu } = appAction;
const { store } = userAction;

export default function SignIn() {
  let history = useHistory();
  let location = useLocation();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.Auth.idToken);

  const [form] = Form.useForm();
  const [errMsg, setErrMsg] = React.useState("");

  const onFinish = (values) => {
    userService.login(values).then(res => {
      if(res.code === '0000'){
        dispatch(login(res.access_token));
        dispatch(store());
        dispatch(clearMenu());
        history.push('/dashboard');
      } else {
        setErrMsg(res.message);
      }
    });
  };

  const [redirectToReferrer, setRedirectToReferrer] = React.useState(false);
  React.useEffect(() => {
    if (isLoggedIn) {
      setRedirectToReferrer(true);
    }
  }, [isLoggedIn]);

  let { from } = location.state || { from: { pathname: '/dashboard' } };

  const marginBot = {
    marginBottom: '10px',
  };

  if (redirectToReferrer) {
    return <Redirect to={from} />;
  }
  return (
    <SignInStyleWrapper className="isoSignInPage">
      <div className="isoLoginContentWrapper">
        <div className="isoLoginContent">
          <div className="isoLogoWrapper">
            <Link to="/dashboard">
              <img src={logo} height="40"/>
            </Link>
          </div>
          {
            errMsg && 
            <Alert
              message={errMsg}
              type="error"
              style={marginBot}
            />
          }
          <div className="isoSignInForm">
            <Form
              form={form}
              name="register"
              onFinish={onFinish}
              scrollToFirstError
            >
              <Form.Item
                name="email"
                className="isoInputWrapper"
                rules={[
                  {
                    type: 'email',
                    message: 'The input is not valid Email!',
                  },
                  {
                    required: true,
                    message: 'Please input your Email!',
                  },
                ]}
              >
                <Input size="large" placeholder="Email"/>
              </Form.Item>
              <Form.Item
                name="password"
                className="isoInputWrapper"
                rules={[
                  {
                    required: true,
                    message: 'Please input your Password!',
                  },
                  {
                    min: 6,
                    message: 'Password must be minimum 6 characters.'
                  }
                ]}
              >
                <Input type="password" size="large" placeholder="Password"/>
              </Form.Item>
              
              <Form.Item>
                <Button type="primary" htmlType="submit" className="btn-success">
                  <IntlMessages id="page.signInButton" />
                </Button>
              </Form.Item>
            </Form>

            <div className="isoCenterComponent isoHelperWrapper">
              <Link to="/resendemail" className="isoForgotPass">
                <IntlMessages id="page.signInResendEmail" />
              </Link>
              <Link to="/signup">
                <IntlMessages id="page.signInCreateAccount" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </SignInStyleWrapper>
  );
}
