import React, { useState, useEffect } from 'react';
import { Marker } from 'react-leaflet';
import MobModal from './MobModal';
import { mobService, primaryObjectService } from '@iso/services';
import { useSelector, useDispatch } from 'react-redux';
import modalActions from '@iso/redux/modal/actions';
import btnSaveAction from '@iso/redux/btnSave/actions';
import {  IconMob  } from '../../Icons/IconMob';
import _ from 'lodash';

const { show } = btnSaveAction;

const { openModal } = modalActions;

const Mob = (props) => {
  const [mobs, setMobs] = useState({});
  const objectRef = React.useRef([]);
  const dispatch = useDispatch();

  const [dataMob, setDataMob] = useState({});
  const [primaryObjects, setPrimaryObjects] = useState([]);
  const saveSuccess = useSelector((state) => state.btnSave.saveSuccess);
  const dataBtnSave = useSelector((state) => state.btnSave.data);
  const cancelSave = useSelector((state) => state.btnSave.cancelSave);
  const dataTransfer = useSelector((state) => state.btnSave.data);
  const modalData = useSelector((state) => state.modal.modalData);

  const updateDataMobs = React.useCallback((propertyId) => {
    mobService.getList(propertyId).then(res => {
      if(res.code === '0000'){
        setMobs(res.mobs);
      }
    })
  }, [props.primaryObjects]);

  useEffect(() => {
    if(saveSuccess && dataBtnSave.type === 'area'){
      const primaryObjectId = dataBtnSave.dataId;
      setTimeout(() => {
        updateDataMobs(props.propertyId)
      }, 500);
    }
  }, [saveSuccess, dataBtnSave]);

  useEffect(() => {
    setPrimaryObjects(props.primaryObjects);
  }, [props.primaryObjects]);

  useEffect(() => {
    if(props.propertyId){
      updateDataMobs(props.propertyId);
    }
  }, [updateDataMobs, props.propertyId]);

  const saveLocation = React.useCallback((mob, dataTransfer) => {
    var layer = objectRef.current[mob.id].leafletElement;

    var point = dataTransfer.points;

    const data = {
      mob:{
        ...mob,
        point
      }
    }
    mobService.storeOrUpdate(data, mob.id).then(res => {
      if(res.code === '0000'){
        updateDataMobs(res.mob.property_id)
        layer.editing.disable();
      }
    });

  }, []);

  const cancelSaveArea = React.useCallback((propertyId, dataObjectId) => {
    var layer = objectRef.current[dataObjectId].leafletElement;
    layer.editing.disable();
  }, []);

  useEffect(() => {
    if(saveSuccess && dataTransfer.type === 'mob' && dataMob){
      saveLocation(dataMob, dataTransfer);
    } else if (cancelSave && dataTransfer.type === 'mob'){
      cancelSaveArea(props.propertyId, dataMob.id);
    }
  }, [saveSuccess, saveLocation, dataTransfer, props.propertyId, cancelSave, dataMob])


  const handleShowMobs = (data) => {
    var html = [];
    if(data.length > 0){
      _.forEach(data, function(mob){
        html.push(
          <Marker 
            key={mob.id} 
            position={[mob.lat, mob.lng]}
            icon={IconMob(mob.tag_colour)}
            onClick={handleClickMob.bind(this, mob)}
            onRemove={handleRemoveMob.bind(this, mob)}
            ref={el => (objectRef.current[mob.id] = el)}            
          />
        );
      });
    }
    return html;
  }

  const handleClickMob = (object, e) => {
    //Not trigger anything if on deleted state
    if(!props.controlDraw.current.leafletElement._toolbars.edit._modes.remove.handler._enabled){
      const modalData = {
        object,
        type: 'mob',
        canCreate: true
      }
      dispatch(openModal(modalData));
    }
  }

  const handleRemoveMob = (object, e) => {
    props.handleSetDeletedMobs(object.id);    
  }

  const onSaved = (savedMob) => {
    let mobTmps = _.clone(mobs);
    const mobIndex = _.findIndex(mobTmps, (mob) => {
      return mob.id === savedMob.id
    });
    if(mobIndex === -1){
      mobTmps.push(savedMob);
    } else {
      mobTmps[mobIndex] = savedMob;
    }
    setMobs(mobTmps);
  }

  const editLocation = () => {
    const data = {
      objectRef,
      dataId: modalData.object.id,
      type: 'mob'
    }
    dispatch(show(data));
    setDataMob(modalData.object);
    objectRef.current[modalData.object.id].leafletElement.editing.enable();
  }

  return (
    <>
      {handleShowMobs(mobs)}
      <MobModal        
        updateDataMobs={updateDataMobs}
        propertyId={props.propertyId}
        editLocation={editLocation}
        primaryObjects={primaryObjects}
        onSaved={onSaved}
      />
    </>
  )
}

export default Mob;