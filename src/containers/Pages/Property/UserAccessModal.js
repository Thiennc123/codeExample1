import React, { useState, useEffect, useCallback } from 'react';
import { Form, Input, Button, Select } from 'antd';
import IntlMessages from '@iso/components/utility/intlMessages';
import PropertyModalWrapper from './PropertyModal.styles';
import SimpleTable from '@iso/components/Tables/SimpleTable';
import { configs } from '@iso/components/Tables/configs';
import fakeData from '@iso/components/Tables/data';
import { CheckCircleFilled, ExclamationCircleFilled } from '@ant-design/icons';
import { propertyService, userService, permissionService } from '@iso/services';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import Loader from '@iso/components/utility/loader';

const { Option } = Select;

const UserAccessModal = (props) => {
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const dataList = new fakeData(users.length, users);
  const [form] = Form.useForm();
  const permissions = useSelector(state => state.permission.permissions);
  const [showForm, setShowForm] = useState(false);

  const updateDataTable = useCallback(() => {
    propertyService.getListUsersOfProperty(props.propertyId).then(res => {
      if(res.code === '0000'){
        setUsers(res.users);
        setModalLoading(false);
      }
    });
  }, [props]);

  useEffect(() => {
    if(props.propertyId){
      updateDataTable();
      permissionService.getUserPermission(props.propertyId).then(res => {
        if(res.code === '0000'){
          setShowForm(res.permission === "owner" || res.permission === "admin");
        }
      });
    }
  }, [props, updateDataTable]);

  const cancelModal = () => {
    props.cancelModal();
    form.resetFields();
    setLoading(false);
  }

  const customColumns = () => {
    const columns = [
      {
        title: <IntlMessages id="antTable.title.user" />,
        key: 'name',
        width: 100,
        render: object => configs.renderCell(object, 'TextCell', 'name'),
      },
      {
        title: <IntlMessages id="antTable.title.email" />,
        key: 'email',
        width: 100,
        render: object => configs.renderCell(object, 'TextCell', 'email'),
      },
      {
        title: <IntlMessages id="antTable.title.permission" />,
        key: 'permission',
        width: 100,
        render: object => configs.renderCell(object, 'TextCell', 'permission'),
      },
      {
        title: <IntlMessages id="antTable.title.status" />,
        key: 'status',
        width: 100,
        align: 'center',
        render: object => {
          return (
            object.status ?
            <CheckCircleFilled style={{color: '#65bb38', fontSize: '18px'}} title="Active"/>
            : <ExclamationCircleFilled style={{color: '#ffcc00', fontSize: '18px'}} title="Outgoing"/>
          );
        },
      },
    ];

    let indexUserOutgoing = _.findIndex(users, function(user){
      return user.status === false;
    })

    if(indexUserOutgoing !== -1){
      columns.push(
        {
          title: '',
          key: 'cancelInvite',
          width: 100,
          render: object => {
            return (
              !object.status &&
              <Button key="submit" onClick={handleCancelInvite.bind(this, object)}>
                {<IntlMessages id="propertyPage.modal.cancelInvite" />}
              </Button>
            );
          },
        },
      )
    }

    return columns;
  }

  const handleCancelInvite = (object) => {
    setModalLoading(true);
    propertyService.cancelInviteUser(props.propertyId, object.id).then(res => {
      if(res.code === '0000'){
        updateDataTable();
      }
    });
  }

  const renderOptionsPermission = () => {
    let options = [];
    _.forEach(permissions, (permission) => {
      options.push(
        <Option key={permission.id} value={permission.slug}>{permission.name}</Option>
      );
    })
    return (
      <Select
        placeholder="Select a permission"
        allowClear
        size="large"
      >
        {options}
      </Select>
    );
  }

  const handleSubmit = (e) => {
    setLoading(true);

    form
      .validateFields()
      .then(values => {
        setModalLoading(true);
        onStore(values);
      })
      .catch(info => {
        console.log('Validate Failed:', info);
        setLoading(false);
      });
  }

  const onStore = (values) => {
    propertyService.inviteUser(props.propertyId, values).then(res => {
      if(res.code === '0000'){
        updateDataTable();
        form.resetFields();
        setLoading(false);
      }
    });
  }

  return (
    <PropertyModalWrapper
      className="user-access-modal"
      forceRender={true}
      visible={props.visible}
      title={<IntlMessages id="propertyPage.modal.userAccess" />}
      onCancel={cancelModal}
      footer={[
        <Button key="back" onClick={cancelModal}>
          {<IntlMessages id="propertyPage.modal.cancel" />}
        </Button>,
        <Button key="submit" className="btn-success" type="primary" loading={loading} onClick={handleSubmit}>
          {<IntlMessages id="propertyPage.modal.save" />}
        </Button>,
      ]}
    >
      {
        modalLoading ?
        <Loader /> :
        <SimpleTable columns={customColumns()} dataList={dataList ? dataList : new fakeData(0, [])} pagination={false} />
      }

      <Form
        form={form}
        name="inviteUser"
        layout="vertical"
        scrollToFirstError
      >
        {
          showForm &&
          <div>
            <div className="form-title">
              <h3>Invite User Form</h3>
            </div>
            <div className="form-body">
              <Form.Item
                name="user_email"
                className="isoInputWrapper"
                label="User Email"
                rules={[
                  {
                    required: true,
                    message: 'This field is required',
                  },
                  {
                    type: 'email',
                    message: 'The input is not valid Email',
                  },
                  () => ({
                    validator(rule, value) {
                      if(value)
                        return userService.checkEmailExistsInProperty(value, props.propertyId);
                      else
                        return Promise.resolve();
                    },
                  }),
                ]}
              >
                <Input className="pac-target-input" size="large" placeholder="Input user email"/>
              </Form.Item>
              <Form.Item
                name="permission"
                label="Permission"
                rules={[
                  {
                    required: true,
                    message: 'This field is required',
                  },
                ]}
              >
                {renderOptionsPermission()}
              </Form.Item>
            </div>
          </div>
        }
      </Form>
    </PropertyModalWrapper>
  );
}

export default UserAccessModal;