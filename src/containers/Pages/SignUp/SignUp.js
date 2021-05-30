import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import IntlMessages from '@iso/components/utility/intlMessages';
import SignUpStyleWrapper from './SignUp.styles';
import { userService } from '@iso/services';
import { Form, Input, Button } from 'antd';
import queryString from 'query-string';
import { SendOutlined } from '@ant-design/icons';
import Alert from '@iso/components/Feedback/Alert';
import logo from '@iso/assets/images/logo.png';

const SignUp = (props) => {
  const [form] = Form.useForm();
  const [showMsg, setShowMsg] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState("abc11@yopmail.com");
  const [msgAlert, setMsgAlert] = React.useState("");
  const token = queryString.parse(window.location.search).token || '';
  let history = useHistory();

  const onFinish = (values) => {
    const data = {
      user: values,
      token
    }
    setUserEmail(values.email);
    userService.registers(data).then(res => {
      if(res.code === '0000'){
        if(token) {
          history.push('/dashboard');
        } else {
          setShowMsg(true);
        }
      }
    });
  };

  const resendEmail = () => {
    userService.resendEmailConfirm(userEmail).then(res => {
      if(res.code === '0000'){
        setMsgAlert('Your request has been sent');
      }
    });
    setTimeout(() => {
      setMsgAlert("");
    }, 3000);
  }

  return (
    <SignUpStyleWrapper className="isoSignUpPage">
      <div className={`isoSignUpContentWrapper ${showMsg ? `w-unset` : ``}`}>
        <div className="isoSignUpContent">
          {
            showMsg ?
            (
              <div className="showMsg">
                <div className="icon-content">
                  <Link to="/signin">
                    <SendOutlined style={{fontSize: '40px'}}/>
                  </Link>
                </div>
                <div className="text-content">
                  <h2>We've sent an email to {userEmail}.</h2>
                  <h2>Click the confirmation link in that email to begin using AirAgri.</h2>
                  <div className="msg-helper">
                    {
                      msgAlert && 
                      <Alert
                        message={msgAlert}
                        type='success'
                        style={{marginBottom: '10px'}}
                      />
                    }
                    <p>if you did not receive the email,</p>
                    <p className="link-resend" onClick={resendEmail}>Resend another email</p>
                  </div>
                </div>
              </div>
            ) : 
            (
              <div>
                <div className="isoLogoWrapper">
                  <Link to="/dashboard">
                    <img src={logo} height="40"/>
                  </Link>
                </div>
                <div className="isoSignUpForm">
                  <Form
                    form={form}
                    name="register"
                    onFinish={onFinish}
                    scrollToFirstError
                  >
                    <Form.Item
                      name="name"
                      className="isoInputWrapper"
                      rules={[
                        {
                          required: true,
                          message: 'Please input your Name!',
                        },
                        {
                          whitespace:true,
                          message:'No blank space',
                        },
                      ]}
                    >
                      <Input size="large" placeholder="Name"/>
                    </Form.Item>

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
                        () => ({
                          validator(rule, value) {
                            if(value)
                              return userService.checkEmailExists(value);
                            else
                              return Promise.resolve();
                          },
                        }),
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

                    <Form.Item
                      name="password_confirmation"
                      className="isoInputWrapper"
                      dependencies={['password']}
                      rules={[
                        {
                          required: true,
                          message: 'Please input your Confirm Password!',
                        },
                        ({ getFieldValue }) => ({
                          validator(rule, value) {
                            if (!value || getFieldValue('password') === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject('The two passwords that you entered do not match!');
                          },
                        }),
                      ]}
                    >
                      <Input type="password" size="large" placeholder="Confirm Password"/>
                    </Form.Item>

                    <Form.Item
                      name="mobile_phone"
                      className="isoInputWrapper"

                    >
                      <Input size="large" placeholder="Mobile Phone"/>
                    </Form.Item>

                    <Form.Item>
                      <Button type="primary" htmlType="submit" className="btn-success">
                        <IntlMessages id="page.signUpButton" />
                      </Button>
                    </Form.Item>

                    <div className="isoInputWrapper isoCenterComponent isoHelperWrapper">
                      <Link to="/signin">
                        <IntlMessages id="page.signUpAlreadyAccount" />
                      </Link>
                    </div>
                  </Form>
                </div>
              </div>
            )
          }
        </div>
      </div>
    </SignUpStyleWrapper>
  );
}

export default SignUp;