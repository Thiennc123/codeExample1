import React from 'react';
import { Link } from 'react-router-dom';
import IntlMessages from '@iso/components/utility/intlMessages';
import ResendEmailConfirmStyleWrapper from './ResendEmailConfirm.styles';
import Alert from '@iso/components/Feedback/Alert';
import { Form, Input, Button } from 'antd';
import { userService } from '@iso/services';
import logo from '@iso/assets/images/logo.png';

export default function() {
  const [msgAlert, setMsgAlert] = React.useState("");
  const [typeAlert, setTypeAlert] = React.useState("");
  const [form] = Form.useForm();
  const marginBot = {
    marginBottom: '10px',
  };

  const onFinish = (values) => {
    userService.resendEmailConfirm(values.email).then(res => {
      if(res.code === '0000'){
        setTypeAlert('success');
        setMsgAlert('Your request has been sent');
      } else {
        setTypeAlert('error');
        setMsgAlert(res.message);
      }
      form.resetFields();
    });
    setTimeout(() => {
      setMsgAlert("");
    }, 5000);
  };

  return (
    <ResendEmailConfirmStyleWrapper className="isoForgotPassPage">
      <div className="isoFormContentWrapper">
        <div className="isoFormContent">
          <div className="isoLogoWrapper">
            <Link to="/dashboard">
              <img src={logo} height="40"/>
            </Link>
          </div>

          <div className="isoFormHeadText">
            <h3>
              <IntlMessages id="page.resendEmailSubTitle" />
            </h3>
            <p>
              <IntlMessages id="page.resendEmailDescription" />
            </p>
          </div>
          {
            msgAlert && 
            <Alert
              message={msgAlert}
              type={typeAlert}
              style={marginBot}
            />
          }
          <div className="isoForgotPassForm">
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

              <div className="isoInputWrapper">
                <Button type="primary" htmlType="submit" className="btn-success">
                  <IntlMessages id="page.sendRequest" />
                </Button>
              </div>
            </Form>
            <div className="isoCenterComponent isoHelperWrapper">
              <Link to="/signin" className="isoForgotPass">
                <IntlMessages id="page.resendEmailBackToSignIn" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ResendEmailConfirmStyleWrapper>
  );
}
