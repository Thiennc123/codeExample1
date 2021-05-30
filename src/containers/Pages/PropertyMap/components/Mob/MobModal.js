import React, { useState, useEffect } from 'react';
import IntlMessages from '@iso/components/utility/intlMessages';
import MobModalWrapper from './MobModal.styles';
import BreedModalWrapper from './BreedModal.styles';
import { Form, Input, Button, Select, Row, Col, DatePicker, Tabs } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import modalActions from '@iso/redux/modal/actions';
import Loader from '@iso/components/utility/loader';
import { mobService, breedService,  } from '@iso/services';
import moment from 'moment';
import { objectColors } from '@iso/constants/objectColors';
import _ from 'lodash';
import styled from "styled-components";
import { dateHelper } from '@iso/lib/helpers/dateHelper';
import L from 'leaflet';

const { Option } = Select;
const { closeModal } = modalActions;
const { TabPane } = Tabs;

const MobModal = (props) => {
  const [form] = Form.useForm();
  const [breedForm] = Form.useForm();
  const [fields, setFields] = useState([]);
  const dispatch = useDispatch();
  const modalVisibility = useSelector((state) => state.modal.modalVisibility);
  const modalData = useSelector((state) => state.modal.modalData);
  const [loading, setLoading] = useState(false);
  const [loadingBreed, setLoadingBreed] = useState(false);
  const [modalLoading, setModalLoading] = useState(true);
  const [dataMob, setDataMob] = useState({});
  const [visibleBreed, setVisibleBreed] = useState(false);
  const [breeds, setBreeds] = useState({});

  const getRandomLatLng = (coordinates) => {
    var polygon = L.polygon([
      coordinates
    ]);
    var bounds = polygon.getBounds();
    var x_max = bounds.getEast();
    var x_min = bounds.getWest();
    var y_max = bounds.getSouth();
    var y_min = bounds.getNorth();
    var lat = y_min + (Math.random() * (y_max - y_min));
    var lng = x_min + (Math.random() * (x_max - x_min));

    return new L.LatLng(
          lat,
          lng
    );
  }
 
  useEffect(() => {
    if(props.propertyId){
       breedService.getList(props.propertyId).then(res => {
        if(res.code === '0000'){
          setBreeds(res.breeds);
          setModalLoading(false);
        }
      });
    }
  }, [props.propertyId]);
  
  const cancelModal = () => {
    dispatch(closeModal());
    if(modalData.layer){
      modalData.featureGroup.leafletElement.removeLayer(modalData.layer);
    }
    setLoading(false);
  }

  const handleBreedSubmit = (e) => {
    breedForm
      .validateFields()
      .then(breed_values => {
        onStoreBreed(breed_values);
      })
      .catch(info => {
        console.log('Validate Failed:', info);
        setLoadingBreed(false);
      });
  }

  const addBreed = (object, e) => {
    setVisibleBreed(true);
  }

  const cancelModalBreed = () => {
    setVisibleBreed(false);
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
    const selectedObject = _.find(props.primaryObjects, (object) => {
      return object.id === values.mob.primary_object_id;
    });
 
    let point = getRandomLatLng(selectedObject.area);
    const data = {
      mob: {
        ...values.mob,
        date_of_birth: values.mob.date_of_birth ? dateHelper.dateForAPI(values.mob.date_of_birth) : '',
        point,
        property_id: props.propertyId
      }
    }

    mobService.storeOrUpdate(data, dataMob.id).then(res => {
      if(res.code === '0000'){
        props.onSaved(res.mob);
        cancelModal();
        form.resetFields();
      } else {
        setLoading(false);
      }
    });
  }

  

  const onStoreBreed = (breed_values) => {
    const breed_data = {
      "breed":{
        ...breed_values.breed,
        property_id: props.propertyId
      }
    }

    breedService.storeOrUpdate(breed_data).then(res => {
      if(res.code === '0000'){
        var tmp_breeds = _.clone(breeds);
        tmp_breeds.push(res.breed);
        setBreeds(tmp_breeds);
        cancelModalBreed();
        breedForm.resetFields();
        setFields([
          {
            name: ['mob', 'breed'],
            value: res.breed.slug,
          },
        ]);
      } else {
        setLoadingBreed(false);
      }
    });

  }

  useEffect(() => {
    if(modalData.type === 'mob'){
      if(modalData.object){
        setDataMob(modalData.object);
      }

      setFields([
        {
          name: ['mob', 'name'],
          value: modalData.object.name || '',
        },
        {
          name: ['mob', 'type'],
          value: modalData.object.type || '',
        },
        {
          name: ['mob', 'breed'],
          value: modalData.object.breed || '',
        },
        {
          name: ['mob', 'tag_colour'],
          value: modalData.object.tag_colour || 'blue',
        },
        {
          name: ['mob', 'tag_number_range'],
          value: modalData.object.tag_number_range || '',
        },
        {
          name: ['mob', 'date_of_birth'],
          value: modalData.object.date_of_birth ? moment(modalData.object.date_of_birth) : '',
        },
        {
          name: ['mob', 'description'],
          value: modalData.object.description || '',
        },
        {
          name: ['mob', 'primary_object_id'],
          value: modalData.object.primary_object_id || '',
        },
      ]);
    }
  }, [props.propertyId, modalVisibility, modalData]);

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

  const renderOptionsBreed = (mob_breed_options) => {
    let breed_options = [];
     _.forEach(mob_breed_options, (breed_opt, index) => {
      breed_options.push(
        <Option key={index} value={breed_opt.slug}>
            <div>{breed_opt.name}</div>
        </Option>
      );
    })
    return (
      <Select
        placeholder="Select a breed"
        allowClear
        size="large"
      >
        {breed_options}
      </Select>
    );
  }

  const editLocation = () => {
    cancelModal();
    props.editLocation();
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
        placeholder="Select an object"
        allowClear
        size="large"
      >
        {options}
      </Select>
    );
  }

  return(
    <>
    <MobModalWrapper
      visible={modalVisibility && modalData.type === 'mob'}
      onCancel={cancelModal}
      maskClosable={false}
      title={dataMob.id ? <IntlMessages id="propertyPage.modal.mob.editMob"/> : <IntlMessages id="propertyPage.modal.mob.addMob"/>}
      footer={[
        <Button key="back" onClick={cancelModal}>
          {<IntlMessages id="propertyPage.modal.cancel" />}
        </Button>,
        <Button key="submit" className="btn-success" type="primary" onClick={handleSubmit} loading={loading}>
          {<IntlMessages id="propertyPage.modal.save" />}
        </Button>,
      ]}
    >
       <Tabs defaultActiveKey="1" className="form-body">
            <TabPane tab={<IntlMessages id="propertyPage.mobModal.detailTab" />} key="1">
             {
                  modalLoading ?
                  <Loader /> : 
                    <Form
                      form={form}
                      layout="vertical"
                      scrollToFirstError
                      fields={fields}
                      id="#1"
                    >
                    <div>
                      <Form.Item
                        name={['mob', 'name']}
                        className="isoInputWrapper"
                        label="Name"
                        rules={[
                          {
                            required: true,
                            message: 'This field is required',
                          },
                          {
                            whitespace: true,
                            message: 'Please input your name',
                          }
                        ]}
                      >
                        <Input size="large" placeholder="Input mob name"/>
                      </Form.Item>
                      <Row>
                        <Col xs={{span: 15}} md={{span: 17}}>
                          <Form.Item
                            name={['mob', 'breed']}
                            className="isoInputWrapper"
                            label="Breed"
                            rules={[
                              {
                                required: true,
                                message: 'This field is required',
                              },
                            ]}
                          >
                          {renderOptionsBreed(breeds)}
                          </Form.Item>
                        </Col>
                        <Col xs={{span: 7, offset: 2}} md={{span: 5, offset: 2}}>
                          <Button key="submit" className="btn-create-breed" type="primary" onClick={addBreed}>
                            {<IntlMessages id="propertyPage.modal.breed.addBreed" />}
                          </Button>
                        </Col>
                      </Row>
                      <Row>
                        <Col xs={{span: 24}} md={{span: 11}}>
                          <Form.Item
                            name={['mob', 'date_of_birth']}
                            className="isoInputWrapper"
                            label="Date Of Birth"
                            rules={[
                              {
                                required: true,
                                message: 'This field is required',
                              },
                            ]}
                          >
                             <DatePicker size="large" style={{width: '100%'}}/>
                          </Form.Item>
                        </Col>
                        <Col xs={{span: 24}} md={{span: 11, offset: 2}}>
                          <Form.Item
                            name={['mob', 'type']}
                            className="isoInputWrapper"
                            label="Type"
                            rules={[
                              {
                                required: true,
                                message: 'This field is required',
                              },
                            ]}
                          >
                            <Input size="large" placeholder="Input mob type"/>
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row>
                        <Col xs={{span: 24}} md={{span: 11}}>
                          <Form.Item
                            name={['mob', 'tag_colour']}
                            className="isoInputWrapper"
                            label="Tag Colour"
                            rules={[
                              {
                                required: true,
                                message: 'This field is required',
                              },
                            ]}
                          >
                            {renderOptionsColor()}
                          </Form.Item>
                        </Col>
                        <Col xs={{span: 24}} md={{span: 11, offset: 2}}>
                          <Form.Item
                            name={['mob', 'tag_number_range']}
                            className="isoInputWrapper"
                            label="Tag Number Range"
                            rules={[
                              {
                                required: true,
                                message: 'This field is required',
                              },
                            ]}
                          >
                            <Input size="large" placeholder="Input tag number range"/>
                          </Form.Item>
                        </Col>
                      </Row>
                      {!modalData.canCreate || dataMob.id ? (
                      <Form.Item
                        name={['mob', 'primary_object_id']}
                        className="isoInputWrapper"
                        label="Object"
                        rules={[
                          {
                            required: true,
                            message: 'This field is required',
                          },
                        ]}
                      >
                        {renderOptionObject(props.primaryObjects)}
                      </Form.Item>
                      ) : ''}
                      <Form.Item
                        name={['mob', 'description']}
                        className="isoInputWrapper"
                        label="Description"
                      >
                        <Input.TextArea />
                      </Form.Item>
                    </div>  
                </Form>
              }
            </TabPane>
            <TabPane tab={<IntlMessages id="propertyPage.mobModal.livestockTab" />} key="2">
              Content of Livestock Tab 
            </TabPane>
        </Tabs>      
    </MobModalWrapper>
    <BreedModalWrapper
      visible={visibleBreed}
      onCancel={cancelModalBreed}
      centered
      title={ <IntlMessages id="propertyPage.modal.breed.addBreed.title"/> }
      footer={[        
        <Button key="back" onClick={cancelModalBreed}>
          {<IntlMessages id="propertyPage.modal.cancel" />}
        </Button>,
        <Button key="submit" className="btn-success" type="primary" onClick={handleBreedSubmit} loading={loadingBreed}>
          {<IntlMessages id="propertyPage.modal.save" />}
        </Button>,
      ]}
    >
    {
      modalLoading ?
      <Loader /> : 
          <Form
            form={breedForm}
            layout="vertical"
            scrollToFirstError
          >
          <div className="form-body">
            <Form.Item
              name={['breed', 'name']}
              className="isoInputWrapper"
              label="Breed"
              rules={[
                {
                  required: true,
                  message: 'This field is required',
                },
              ]}
            >
              <Input size="large" placeholder="Input breed"/>
            </Form.Item>
            </div>    
      </Form>
    }
    </BreedModalWrapper>
    </>
  )
}

export default MobModal;

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