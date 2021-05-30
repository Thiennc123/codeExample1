import React , { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button, Row, Col } from 'antd';
import { propertyService, googleService } from '@iso/services';
import propertyActions from '@iso/redux/property/actions';
import IntlMessages from '@iso/components/utility/intlMessages';
import PropertyModalWrapper from './PropertyModal.styles';
import { Checkbox } from 'antd';
import _ from 'lodash';
import Alert from '@iso/components/Feedback/Alert';

const { loadProperties } = propertyActions;

let autoComplete;

function handleAddressAutoComplete(setAddress, autoCompleteRef, setAddressShortName, setPoint) {
  autoComplete = new window.google.maps.places.Autocomplete(
    autoCompleteRef.current.input,
    { types: ['address'] }
  );

  autoComplete.setFields(['address_components', 'formatted_address']);
  autoComplete.addListener("place_changed", () => {
    handlePlaceSelect(setAddress, setAddressShortName, setPoint)
  });
}

async function handlePlaceSelect(setAddress, setAddressShortName, setPoint) {
  const addressObject = autoComplete.getPlace();
  const fields = [
    {
      name: 'address',
      value: addressObject.formatted_address,
    },
  ]
  for (var i = 0; i < addressObject.address_components.length; i++) {
    var addressType = addressObject.address_components[i].types[0];
    if (addressType === "country") {
      fields.push({
        name: 'country',
        value: addressObject.address_components[i].long_name
      });
    }
    if (addressType === "administrative_area_level_1"){
      fields.push({
        name: 'state',
        value: addressObject.address_components[i].long_name
      });
    }
  }
  setAddress(fields);
}

const PropertyModal = (props) => {
  const dispatch = useDispatch();
  const autoCompleteRef = useRef(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState([]);
  const [contactChecked, setContactChecked] = useState(false);
  const currentUser = useSelector((state) => state.user.user);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    if(autoCompleteRef){
      document.addEventListener('google-script-loaded', handleAddress)
    }
  }, []);

  useEffect(() => {
    setFields([
      {
        name: 'address',
        value: props.editProperty.address,
      },
      {
        name: 'country',
        value: props.editProperty.country,
      },
      {
        name: 'state',
        value: props.editProperty.state,
      },
      {
        name: 'name',
        value: props.editProperty.name,
      },
      {
        name: 'contact_name',
        value: props.editProperty.contact_name,
      },
      {
        name: 'contact_email',
        value: props.editProperty.contact_email,
      },
      {
        name: 'use_my_account',
        value: currentUser.email === props.editProperty.contact_email,
      },
    ]);

    if(Object.keys(props.editProperty).length > 0){
      if(currentUser.email === props.editProperty.contact_email){
        setContactChecked(true);
      } else {
        setContactChecked(false);
      }
    }
  }, [props, currentUser]);

  const handleAddress = () => {
    handleAddressAutoComplete(setFields, autoCompleteRef)
  }

  const cancelModal = () => {
    props.cancelModal();
    resetForm();
  }

  const handleSubmit = (e) => {
    setLoading(true);

    form
      .validateFields()
      .then(async (values) => {
        const res = await googleService.getLatLng(values.address);

        var point = {};
        var addressShortName = {};

        if(res.results.length > 0 && res.results[0].geometry){
          point = {
            lat: res.results[0].geometry.location.lat,
            lng: res.results[0].geometry.location.lng,
          };

          const addressComponents = res.results[0].address_components;
          const indexCountry = _.findIndex(addressComponents, function(address) { return address.types[0] === 'country'; });
          const indexState = _.findIndex(addressComponents, function(address) { return address.types[0] === 'administrative_area_level_1'; });
          addressShortName = {
            country: addressComponents[indexCountry].short_name || '',
            state: addressComponents[indexState].short_name || '',
          }
        } else {
          setErrMsg("The address invalid");
        }

        const data = {
          property: Object.assign(values, { point }),
          addressShortName: addressShortName
        }

        if(Object.keys(addressShortName).length !== 0){
          onStore(data);
        } else {
          setLoading(false);
          setTimeout(() => {
            setErrMsg("");
          }, 3000);
        }
      })
      .catch(info => {
        console.log('Validate Failed:', info);
        setLoading(false);
      });
  }

  const onStore = (data) => {
    propertyService.storeOrUpdateProperties(data, props.editProperty.id).then(res => {
      if(res.code === '0000'){
        dispatch(loadProperties());
        props.cancelModal();
        resetForm();
      }
    });
  }

  const resetForm = () => {
    setTimeout(() => {
      form.resetFields();
      handleAddress();
      setLoading(false);
      setContactChecked(false);
      setErrMsg("");
    }, 500);
  }

  const onChangeCheckBox = e => {
    setContactChecked(e.target.checked);
  }

  return (
    <PropertyModalWrapper
      forceRender={true}
      visible={props.visible}
      title={<IntlMessages id="propertyPage.modal.propertyDetail" />}
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
      <Form
        form={form}
        name="addProperty"
        layout="vertical"
        scrollToFirstError
        initialValues={{
          use_my_account: false,
        }}
        fields={fields}
      >
        {
          errMsg &&
          <Alert
            message={errMsg}
            type="error"
            style={{margin: '15px 15px 0 15px'}}
          />
        }
        <div className="form-body">
          <Form.Item
            name="name"
            className="isoInputWrapper"
            label="Property Name"
            rules={[
              {
                required: true,
                message: 'Please input your property name',

              },
              {
                max:256,
                message: 'Password must be minimum 256 characters.'
              },
              {
                whitespace:true,
                message: 'Please input your name',
              },
            ]}
          >
            <Input size="large" placeholder="Input your property name"/>
          </Form.Item>
          <Form.Item
            name="address"
            className="isoInputWrapper"
            label="Address"
            rules={[
              {
                required: true,
                message: 'Please input your address',
              },
            ]}
          >
            <Input className="pac-target-input" size="large" placeholder="Input your address" ref={autoCompleteRef}/>
          </Form.Item>
          <Row>
            <Col xs={{span: 24}} md={{span: 11}}>
              <Form.Item
                name="country"
                className="isoInputWrapper"
                label="Country"
                rules={[
                  {
                    required: true,
                    message: 'Please input your country',
                  },
                ]}
              >
                <Input size="large" placeholder="Input your country"/>
              </Form.Item>
            </Col>
            <Col xs={{span: 24}} md={{span: 11, offset: 2}}>
              <Form.Item
                name="state"
                className="isoInputWrapper"
                label="State"
                rules={[
                  {
                    required: true,
                    message: 'Please input your state',
                  },
                ]}
              >
                <Input size="large" placeholder="Input your state"/>
              </Form.Item>
            </Col>
          </Row>
        </div>
        <div className="form-title">
          <h3>{<IntlMessages id="propertyPage.modal.contactInfomation" />}</h3>
        </div>
        <div className="form-body">
          <Form.Item
            name="use_my_account"
            className="isoInputWrapper"
            valuePropName="checked"
          >
            <Checkbox className="checkbox-contact" onChange={onChangeCheckBox}>Use my account</Checkbox>
          </Form.Item>
          {
            !contactChecked && (
              <Row>
                <Col xs={{span: 24}} md={{span: 11}}>
                  <Form.Item
                    name="contact_name"
                    className="isoInputWrapper"
                    label="Contact Name"
                  >
                    <Input size="large" placeholder="Input your contact name" disabled={contactChecked}/>
                  </Form.Item>
                </Col>
                <Col xs={{span: 24}} md={{span: 11, offset: 2}}>
                  <Form.Item
                    name="contact_email"
                    className="isoInputWrapper"
                    label="Contact Email"
                    rules={[
                      {
                        type: 'email',
                        message: 'The input is not valid Email!',
                      },
                    ]}
                  >
                    <Input size="large" placeholder="Input your contact email" disabled={contactChecked}/>
                  </Form.Item>
                </Col>
              </Row>
            )
          }
        </div>
      </Form>
    </PropertyModalWrapper>
  );
}

export default PropertyModal;