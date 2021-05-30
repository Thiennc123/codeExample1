import React , { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button, Select, Row, Col, DatePicker } from 'antd';
import { propertyService, mobService, breedService } from '@iso/services';
import IntlMessages from '@iso/components/utility/intlMessages';
import MobModalWrapper from './MobModal.styles';
import _ from 'lodash';
import { objectColors } from '@iso/constants/objectColors';
import BreedModalWrapper from '@iso/containers/Pages/PropertyMap/components/Mob/BreedModal.styles';
import styled from "styled-components";
import modalActions from '@iso/redux/modal/actions';
import moment from 'moment';
import { dateHelper } from '@iso/lib/helpers/dateHelper';

const { Option } = Select;
const { closeModal } = modalActions;

const MobModal = (props) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const activePropertyId = useSelector((state) => state.property.activePropertyId);
  const [breedForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const modalVisibility = useSelector((state) => state.modal.modalVisibility);
  const modalData = useSelector((state) => state.modal.modalData);
  const [fields, setFields] = useState([]);
  const [dataMob, setDataMob] = useState({});
  const [modalLoading, setModalLoading] = useState(true);
  const [breeds, setBreeds] = useState({});
  const [visibleBreed, setVisibleBreed] = useState(false);
  const [loadingBreed, setLoadingBreed] = useState(false);
  const [primaryObjects, setPrimaryObjects] = useState({});

  useEffect(() => {
    if(activePropertyId){
       breedService.getList(activePropertyId).then(res => {
        if(res.code === '0000'){
          setBreeds(res.breeds);
          setModalLoading(false);
        }
      });
    }
  }, [activePropertyId]);

  useEffect(() => {
    if(activePropertyId){
       propertyService.viewProperty(activePropertyId).then(res => {
        if(res.code === '0000'){
          setPrimaryObjects(res.primary_objects);
          setModalLoading(false);
        }
      });
    }
  }, [activePropertyId]);

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

  const onStoreBreed = (breed_values) => {
    const breed_data = {
      "breed":{
        ...breed_values.breed,
        property_id: activePropertyId
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
      if(modalData.mob){
        setDataMob(modalData.mob);
      }
      setFields([
        {
          name: ['mob', 'name'],
          value: modalData.mob.name || '',
        },
        {
          name: ['mob', 'type'],
          value: modalData.mob.type || '',
        },
        {
          name: ['mob', 'breed'],
          value: modalData.mob.breed || '',
        },
        {
          name: ['mob', 'tag_colour'],
          value: modalData.mob.tag_colour || 'blue',
        },
        {
          name: ['mob', 'tag_number_range'],
          value: modalData.mob.tag_number_range || '',
        },
        {
          name: ['mob', 'date_of_birth'],
          value: modalData.mob.date_of_birth ? moment(modalData.mob.date_of_birth) : '',
        },
        {
          name: ['mob', 'description'],
          value: modalData.mob.description || '',
        },
        {
          name: ['mob', 'primary_object_id'],
          value: modalData.mob.primary_object_id || '',
        },
      ]);
    }
  }, [activePropertyId, modalVisibility, modalData.mob]);

  const onStore = (values) => {
    const data = {
      "mob":{
        ...values.mob,
        date_of_birth: values.mob.date_of_birth ? dateHelper.dateForAPI(values.mob.date_of_birth) : '',
        point: dataMob.point,
        property_id: activePropertyId
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

  const cancelModal = () => {
    dispatch(closeModal());
  }

  return(
    <>
    <MobModalWrapper
      visible={modalVisibility}
      onCancel={cancelModal}
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
      {
        
          <Form
            form={form}
            layout="vertical"
            scrollToFirstError
            fields={fields}
          >
          <div className="form-body">
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
                  whitespace:true,
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
              {renderOptionObject(primaryObjects)}
            </Form.Item>
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
    </MobModalWrapper>
    <BreedModalWrapper
      visible={visibleBreed}
      onCancel={cancelModalBreed}
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
                {
                  whitespace: true,
                  message: 'Please input your name',
                }
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