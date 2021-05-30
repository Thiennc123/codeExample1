import React, { useState, useEffect, useCallback } from 'react';
import IntlMessages from '@iso/components/utility/intlMessages';
import TaskModalWrapper from './TaskModal.styles';
import { Form, Input, Button, Select, Row, Col, DatePicker } from 'antd';
import _ from 'lodash';
import { taskPriorities } from '@iso/constants/taskPriorities';
import { taskStatus } from '@iso/constants/taskStatus';
import Loader from '@iso/components/utility/loader';
import { propertyService, taskService } from '@iso/services';
import { dateHelper } from '@iso/lib/helpers/dateHelper';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import modalActions from '@iso/redux/modal/actions';

const { Option } = Select;
const { closeModal } = modalActions;

const TaskModal = (props) => {
  const [form] = Form.useForm();
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(true);
  const [assignees, setAssignees] = useState([]);
  const modalVisibility = useSelector((state) => state.modal.modalVisibility);
  const modalData = useSelector((state) => state.modal.modalData);
  const dispatch = useDispatch();
  const [dataTask, setDataTask] = useState({});
  const updateDataAssignee = useCallback(() => {
    propertyService.getListUsersOfProperty(props.propertyId).then(res => {
      if(res.code === '0000'){
        setAssignees(res.users);
        setModalLoading(false);
      }
    });
  }, [props]);

  useEffect(() => {
    if(modalData.type === 'task'){
      if(modalData.task){
        setDataTask(modalData.task);
      }
      setFields([
        {
          name: ['task', 'title'],
          value: modalData.task.title || '',
        },
        {
          name: ['task', 'due_date'],
          value: modalData.task.due_date ? moment(modalData.task.due_date) : '',
        },
        {
          name: ['task', 'priority'],
          value: modalData.task.priority || 'medium',
        },
        {
          name: ['task', 'status'],
          value: modalData.task.status || 'todo',
        },
        {
          name: ['task', 'assignee_id'],
          value: modalData.task.assignee ? modalData.task.assignee.id : 0,
        },
        {
          name: ['task', 'details'],
          value: modalData.task.details || '',
        },
        {
          name: ['task', 'primary_object_id'],
          value: modalData.task.primary_object_id ? modalData.task.primary_object_id : 0,
        },
      ]);
      if(props.propertyId && modalVisibility){
        updateDataAssignee();
      }
    }
  }, [props.propertyId, updateDataAssignee, modalVisibility, modalData]);

  const cancelModal = () => {
    dispatch(closeModal());
    if(modalData.layer){
      modalData.featureGroup.leafletElement.removeLayer(modalData.layer);
    }
    setLoading(false);
  }

  const renderOptionPriority = () => {
    let options = [];
    _.forEach(taskPriorities, (taskPriority, index) => {
      options.push(
        <Option key={index} value={taskPriority.value}>
          {taskPriority.label}
        </Option>
      );
    })
    return (
      <Select
        allowClear
        size="large"
      >
        {options}
      </Select>
    );
  }

  const renderOptionStatus = () => {
    let options = [];
    _.forEach(taskStatus, (status, index) => {
      options.push(
        <Option key={index} value={status.value}>
          {status.label}
        </Option>
      );
    })
    return (
      <Select
        allowClear
        size="large"
      >
        {options}
      </Select>
    );
  }

  const renderOptionAssignee = (users) => {
    let options = [];
    _.forEach(users, (user, index) => {
      options.push(
        <Option key={user.id} value={user.id}>
          {user.name} | {user.email}
        </Option>
      );
    })
    return (
      <Select
        allowClear
        size="large"
      >
        <Option key={0} value={0}>
          Not assigned
        </Option>
        {options}
      </Select>
    );
  }

  const renderOptionObject = (objects) => {
    let options = [];
    _.forEach(objects, (object, index) => {
      options.push(
        <Option key={object.id} value={object.id}>
          {object.name}
        </Option>
      );
    })
    return (
      <Select
        allowClear
        size="large"
      >
        <Option key={0} value={0}>
          No paddock
        </Option>
        {options}
      </Select>
    );
  }

  const handleSubmit = (e) => {
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
  }

  const onStore = (values) => {
    const data = {
      task:{
        ...values.task,
        due_date: values.task.due_date ? dateHelper.dateForAPI(values.task.due_date) : '',
        point: dataTask.point,
        property_id: props.propertyId
      }
    }

    taskService.storeOrUpdateTasks(data, dataTask.id).then(res => {
      if(res.code === '0000'){
        props.onSaved();
        cancelModal();
        form.resetFields();
      } else {
        setLoading(false);
      }
    });
  }

  const editLocation = () => {
    cancelModal();
    props.editLocation();
  }

  return (
    <TaskModalWrapper
      className="user-access-modal"
      forceRender={true}
      visible={modalVisibility}
      title={ dataTask.id ? <IntlMessages id="propertyMapPage.editTask" /> : <IntlMessages id="propertyMapPage.addTask" /> }
      onCancel={cancelModal}
      maskClosable={false}
      footer={[
        <Button key="back" onClick={cancelModal}>
          {<IntlMessages id="propertyPage.modal.cancel" />}
        </Button>,
        <Button key="submit" className="btn-success" type="primary" onClick={handleSubmit} loading={loading}>
          {<IntlMessages id="propertyPage.modal.save" />}
        </Button>,
      ]}
    >
      {
        modalLoading ?
        <Loader /> :
        <Form
          form={form}
          name="addEditTask"
          layout="vertical"
          scrollToFirstError
          fields={fields}
        >
          <div className="form-body">
            <Form.Item
              name={['task', 'title']}
              className="isoInputWrapper"
              label="Title"
              rules={[
                {
                  required: true,
                  message: 'This field is required',
                },
              ]}
            >
              <Input size="large" placeholder="Input task title"/>
            </Form.Item>
            <Form.Item
              name={['task', 'priority']}
              label="Priority"
              rules={[
                {
                  required: true,
                  message: 'This field is required',
                },
              ]}
            >
              {renderOptionPriority()}
            </Form.Item>
            <Row>
              <Col xs={{span: 24}} md={{span: 11}}>
                <Form.Item
                  name={['task', 'due_date']}
                  className="isoInputWrapper"
                  label="Due Date"
                >
                  <DatePicker size="large"/>
                </Form.Item>
              </Col>
              <Col xs={{span: 24}} md={{span: 11, offset: 2}}>
                <Form.Item
                  name={['task', 'status']}
                  className="isoInputWrapper"
                  label="Status"
                  rules={[
                    {
                      required: true,
                      message: 'This field is required',
                    },
                  ]}
                >
                  {renderOptionStatus()}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col xs={{span: 24}} md={{span: dataTask.id ? 11 : 24}}>
                <Form.Item
                  name={['task', 'assignee_id']}
                  className="isoInputWrapper"
                  label="Assignee"
                >
                  {renderOptionAssignee(assignees)}
                </Form.Item>
              </Col>
              {
                dataTask.id &&
                <Col xs={{span: 24}} md={{span: 11, offset: 2}}>
                  <Form.Item
                    name={['task', 'primary_object_id']}
                    className="isoInputWrapper"
                    label="Object"
                  >
                    {renderOptionObject(props.primaryObjects)}
                  </Form.Item>
                </Col>
              }
            </Row>
            <Form.Item name={['task', 'details']} label="Details">
              <Input.TextArea />
            </Form.Item>
          </div>
        </Form>
      }
    </TaskModalWrapper>
  );
}

export default TaskModal;