import React from 'react';
import { Button } from 'antd';
import IntlMessages from '@iso/components/utility/intlMessages';
import { useSelector, useDispatch } from 'react-redux';
import btnSaveAction from '@iso/redux/btnSave/actions';

const { cancelSave, saveSuccess } = btnSaveAction;

const BtnSaveGroup = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.btnSave.data);

  const cancel = () => {
    dispatch(cancelSave(data));
    data.objectRef.current[data.dataId].leafletElement.editing.disable();
  }
  const save = () => {
    let points;
    switch(data.type) {
      case 'area':
        points = data.objectRef.current[data.dataId].leafletElement.getLatLngs();
        break;
      case 'task':
        points = data.objectRef.current[data.dataId].leafletElement.getLatLng();
        break;
      case 'mob':
        points = data.objectRef.current[data.dataId].leafletElement.getLatLng();
        break;  
      default:
        return points
    }

    const dataTransfer = {
      ...data,
      points
    }
    dispatch(saveSuccess(dataTransfer));
  }

  return (
    <>
      <Button type="info" onClick={cancel} style={{marginLeft: '5px'}}>
        <IntlMessages id="propertyMapPage.cancel" />
      </Button>
      <Button type="primary" className="btn-success" onClick={save} style={{marginLeft: '5px'}}>
        <IntlMessages id="propertyMapPage.save" />
      </Button>
    </>
  );
}

export default BtnSaveGroup;