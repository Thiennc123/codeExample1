import React, { useState, useEffect } from 'react';
import IntlMessages from '@iso/components/utility/intlMessages';
import PrimaryObjectModalWrapper from './PrimaryObjectModal.styles';
import { Form, Input, Button, InputNumber, Select } from 'antd';
import _ from 'lodash';
import { objectColors } from '@iso/constants/objectColors';
import { objectTypes } from '@iso/constants/objectTypes';
import styled from "styled-components";
import { primaryObjectService } from '@iso/services';
import modalActions from '@iso/redux/modal/actions';
import { useSelector, useDispatch } from 'react-redux';

const { Option } = Select;
const { closeModal } = modalActions;

const PrimaryObjectModal = (props) => {
  const [form] = Form.useForm();
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const modalVisibility = useSelector((state) => state.modal.modalVisibility);
  const modalData = useSelector((state) => state.modal.modalData);
  const dispatch = useDispatch();
  const [dataObject, setDataObject] = useState({});

  useEffect(() => {
    if(modalData.type === 'area'){
      if(modalData.object){
        setDataObject(modalData.object);
      }
      setFields([
        {
          name: ['primary_object', 'name'],
          value: modalData.object.name || '',
        },
        {
          name: ['primary_object', 'color'],
          value: modalData.object.color || 'blue',
        },
        {
          name: ['primary_object', 'type'],
          value: modalData.object.type || 'area',
        },
        {
          name: ['primary_object', 'acreage'],
          value: modalData.object.acreage ? parseFloat(modalData.object.acreage) : 0,
        },
        {
          name: ['primary_object', 'description'],
          value: modalData.object.description || '',
        },
      ]);
    }
  }, [modalData]);

  const cancelModal = () => {
    dispatch(closeModal());
    if(modalData.layer){
      modalData.featureGroup.leafletElement.removeLayer(modalData.layer);
    }
    setLoading(false);
  }

  const handleSubmit = (e) => {
    setLoading(true);

    form
      .validateFields()
      .then(values => {
        values.primary_object.property_id = props.propertyId;
        let coordinates = modalData.object.coordinates || modalData.object.area;
        values.primary_object.data_area = _.map(coordinates, (point) => {
          return point.toString().replace(',', ', ');
        });

        onStore(values);
      })
      .catch(info => {
        console.log('Validate Failed:', info);
        setLoading(false);
      });
  }

  const onStore = (values) => {
    primaryObjectService.storeOrUpdateProperties(values, modalData.object.id).then(res => {
      if(res.code === '0000'){
        cancelModal();
        if(modalData.object.id){
          props.onEdited(res.primary_object);
        } else {
          props.updatePropertyDetail(props.propertyId);
        }
        setLoading(false);
        // props.resetLayer();
      } else {
        setLoading(false);
      }
    });
  }

  const renderOptionsColor = () => {
    let options = [];
    _.forEach(objectColors, (color, index) => {
      options.push(
        <Option key={index} value={color.value}>
          <ColorItemRow>
            <ColorItemPreview style={{backgroundColor: color.color}}></ColorItemPreview>
            <div>{color.label}</div>
          </ColorItemRow>
        </Option>
      );
    })
    return (
      <Select
        placeholder="Select a color"
        allowClear
        size="large"
      >
        {options}
      </Select>
    );
  }

  const renderOptionsType = () => {
    let options = [];
    _.forEach(objectTypes, (type, index) => {
      options.push(
        <Option key={index} value={type.value}>
          <ColorItemRow>
            <div>{type.label}</div>
          </ColorItemRow>
        </Option>
      );
    })
    return (
      <Select
        placeholder="Select a type"
        allowClear
        size="large"
      >
        {options}
      </Select>
    );
  }

  const handleDelete = (object) => {
    primaryObjectService.destroy(object.id).then(res => {
      if(res.code === '0000'){
        cancelModal();
        props.updatePropertyDetail(props.propertyId);
      }
    });
  }

  const editArea = () => {
    cancelModal();
    props.editArea(dataObject.clickedPolygon);
  }

  return (
    <PrimaryObjectModalWrapper
      className="user-access-modal"
      forceRender={true}
      visible={modalVisibility && modalData.type === 'area'}
      title={dataObject.name ? <IntlMessages id="propertyMapPage.editObject" /> : <IntlMessages id="propertyMapPage.addObject" />}
      onCancel={cancelModal}
      maskClosable={false}
      footer={[
        dataObject.name &&
        <Button key="editArea" onClick={editArea} style={{float: 'left'}}>
          {<IntlMessages id="propertyPage.modal.editArea" />}
        </Button>,
        <Button key="back" onClick={cancelModal}>
          {<IntlMessages id="propertyPage.modal.cancel" />}
        </Button>,
        <Button key="submit" className="btn-success" type="primary" onClick={handleSubmit} loading={loading}>
          {<IntlMessages id="propertyPage.modal.save" />}
        </Button>,
        dataObject.name &&
        <Button key="delete" type="danger" onClick={handleDelete.bind(this, dataObject)}>
          {<IntlMessages id="propertyPage.modal.delete" />}
        </Button>,
      ]}
    >
      <Form
        form={form}
        name="addEditPrimaryObject"
        layout="vertical"
        scrollToFirstError
        fields={fields}
      >
        <div className="form-body">
          <Form.Item
            name={['primary_object', 'name']}
            className="isoInputWrapper"
            label="Property Name"
            rules={[
              {
                required: true,
                message: 'This field is required',
              },
              {
                whitespace:true,
                message: 'Please input your Name',
              }
            ]}
          >
            <Input size="large" placeholder="Input your object name"/>
          </Form.Item>
          <AcreageInput>
            <Form.Item
              name={['primary_object', 'acreage']}
              className="isoInputWrapper"
              label="Acreage"
              rules={[
                {
                  required: true,
                  message: 'This field is required',
                },
                {
                  type: 'number',
                }
              ]}
              style={{width: '100%'}}
            >
              <InputNumber size="large" placeholder="Input your object acreage" style={{width: '100%'}}/>
            </Form.Item>
            <SuffixAddon>ha</SuffixAddon>
          </AcreageInput>
          <Form.Item
            name={['primary_object', 'color']}
            label="Color on map"
            rules={[
              {
                required: true,
                message: 'This field is required',
              },
            ]}
          >
            {renderOptionsColor()}
          </Form.Item>
           <Form.Item
            name={['primary_object', 'type']}
            label="Type"
            rules={[
              {
                required: true,
                message: 'This field is required',
              },
            ]}
          >
            {renderOptionsType()}
          </Form.Item>
          
          <Form.Item name={['primary_object', 'description']} label="Description">
            <Input.TextArea />
          </Form.Item>
        </div>
      </Form>
    </PrimaryObjectModalWrapper>
  );
}

export default PrimaryObjectModal;

const ColorItemRow = styled.div`
  display: flex;
  align-items: center;
  line-height: 30px;
  div{
    margin: 4px;
  }
`;

const ColorItemPreview = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 2px;
`;

const SuffixAddon = styled.span`
  margin-top: 31px;
  margin-bottom: 5px;
  line-height: 38px;
  color: #747784!important;
  flex-shrink: 0;
  border-top-right-radius: 4px!important;
  border-bottom-right-radius: 4px!important;
  border-right-width: 1px!important;
  min-width: 36px;
  background-color: #f8f9fa;
  border: solid #d9d9d9;
  border-width: 1px 0;
  white-space: nowrap;
  text-align: center;
`;

const AcreageInput = styled.div`
  display: flex;
  align-items: flex-start;
`;