import React , { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button } from 'antd';
import { profileService } from '@iso/services';
import userActions from '@iso/redux/user/actions';
import IntlMessages from '@iso/components/utility/intlMessages';
import TopbarProfileModalWrapper from './TopbarProfileModal.styles';

const { store } = userActions;

const TopbarProfileModal = (props) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [checkingPassword, setCheckingPassword] = useState(true);
  const [fields, setFields] = useState([]);
  const currentUser = useSelector((state) => state.user.user);
  useEffect(() => {
    if(checkingPassword){
      setFields([
        {
          name: ['profile', 'name'],
          value: currentUser.name || '',
        },
        {
          name: ['profile', 'mobile_phone'],
          value: currentUser.mobile_phone || '',
        },
        {
          name: ['profile', 'current_password'],
          value: '',
        },
        {
          name: ['profile', 'password'],
          value: '',
        },
        {
          name: ['profile', 'confirm_password'],
          value: '',
        },
      ]);
    }
  }, [checkingPassword, props.visibleProfile]);

  const cancelModal = () => {
    props.cancelModal();
    setCheckingPassword(true);
  }

  const handleSubmit = () => {
    setLoading(true);
    form
      .validateFields()
      .then(values => {
        onStore(values);
      })
      .catch(info => {
        console.log('Validate Failed:', info);
        setLoading(false);
      });
    setLoading(false);
  }

  const onStore = async (values) => {
    values.profile.name = values.profile.name.trim();
    values.profile.mobile_phone = values.profile.mobile_phone.trim();
    if(values.profile.current_password === '' && values.profile.password === '' && values.profile.confirm_password === ''){
       const data = {
        "user":{
          ...values.profile
        }
      }
      profileService.updateProfile(data, currentUser.id).then(res => {
        if(res.code === '0000'){
          dispatch(store());
          props.cancelModal();
          setCheckingPassword(true);
        } else {
          setLoading(false);
        }
      });
    }else{
        const current_pwd = {"current_password":values.profile.current_password};
        var res = await profileService.checkCurrentPassword(current_pwd, currentUser.id);
        if(res.code !== '0000'){
          setCheckingPassword(false);
          return false;
        } else {
          const data = {
            "user":{
              ...values.profile
            }
          }
          profileService.updateProfile(data, currentUser.id).then(res => {
            if(res.code === '0000'){
              dispatch(store());
              props.cancelModal();
              setCheckingPassword(true);
            } else {
              setLoading(false);
            }
          });
        }
    }
  }

  return (
    <TopbarProfileModalWrapper
      forceRender={true}
      visible={props.visibleProfile}
      title={<IntlMessages id="topbar.modal.editProfile" />}
      onCancel={cancelModal}
      maskClosable={false}
      footer={[
        <Button key="back" onClick={cancelModal}>
          {<IntlMessages id="propertyPage.modal.cancel" />}
        </Button>,
        <Button key="submit" className="btn-success" type="primary" loading={loading} onClick={handleSubmit}>
          {<IntlMessages id="propertyPage.modal.save" />}
        </Button>,
      ]}
    >
     <Form
            form={form}
            layout="vertical"
            scrollToFirstError
            fields={fields}
          >
          <div className="form-body">
            <Form.Item
              name={['profile', 'name']}
              className="isoInputWrapper"
              label="Name"
              rules={[
                {
                  required: true,
                  message: 'This field is required',
                  whitespace: true,
                },
              ]}
            >
              <Input size="large" placeholder="Input your name"/>
            </Form.Item>
            <Form.Item
              name={['profile', 'mobile_phone']}
              className="isoInputWrapper"
              label="Phone"
              rules={[
                {
                  required: true,
                  message: 'This field is required',
                  whitespace: true,
                },
              ]}
            >
              <Input size="large" placeholder="Input your phone number"/>
            </Form.Item>
            <Form.Item
              name={['profile', 'current_password']}
              className="isoInputWrapper"
              label="Current Password"
              rules={[
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if ((!value && getFieldValue('profile').password === '') || (value && getFieldValue('profile').password !== '')) {
                      return Promise.resolve();
                    }
                    return Promise.reject('This field is required!');
                  },
                }),
              ]}
            >
              <Input type="password" size="large" placeholder="Input your current password"/>
            </Form.Item>
              { (!checkingPassword) ? <div className="ant-form-item-has-error"><div className="ant-form-item-explain"><div>Current Password is incorrect!</div></div></div> : ''}
            <Form.Item
              name={['profile', 'password']}
              className="isoInputWrapper"
              label="New Password"
              rules={[
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if ((!value && getFieldValue('profile').current_password === '')|| getFieldValue('profile').current_password !== value) {
                      return Promise.resolve();
                    }
                    return Promise.reject('The New Password must be different from the Current Password!');
                  },
                }),
              ]}
            >
              <Input size="large" type="password" placeholder="Input your new password"/>
            </Form.Item>
            <Form.Item
              name={['profile', 'confirm_password']}
              className="isoInputWrapper"
              label="Confirm Password"
              rules={[
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if ((!value && getFieldValue('profile').password === '') || getFieldValue('profile').password === value ) {
                      return Promise.resolve();
                    }
                    return Promise.reject('The New Password and Confirm Password do not match!');
                  },
                }),
              ]}
            >
              <Input size="large" type="password" placeholder="Input your new password"/>
            </Form.Item>
          </div>  
      </Form>
    </TopbarProfileModalWrapper>
  );
}

export default TopbarProfileModal;