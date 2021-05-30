import React, { useState, useEffect } from 'react';
import { Marker } from 'react-leaflet';
import {  IconTask  } from '../../Icons/IconTask';
import _ from 'lodash';
import TaskModal from './TaskModal';
import { taskService } from '@iso/services';
import btnSaveAction from '@iso/redux/btnSave/actions';
import { useDispatch, useSelector } from 'react-redux';
import modalActions from '@iso/redux/modal/actions';

const { show } = btnSaveAction;
const { openModal } = modalActions;

const Task = (props) => {
  const [tasks, setTasks] = useState({});
  const [dataTask, setDataTask] = useState({});
  const [primaryObjects, setPrimaryObjects] = useState([]);
  const objectRef = React.useRef([]);
  const dispatch = useDispatch();
  const saveSuccess = useSelector((state) => state.btnSave.saveSuccess);
  const cancelSave = useSelector((state) => state.btnSave.cancelSave);
  const dataTransfer = useSelector((state) => state.btnSave.data);
  const modalData = useSelector((state) => state.modal.modalData);

  const updateDataTasks = React.useCallback((propertyId) => {
    taskService.getList(propertyId).then(res => {
      if(res.code === '0000'){
        setTasks(res.tasks);
      }
    })
  }, [props.primaryObjects]);

  useEffect(() => {
    setPrimaryObjects(props.primaryObjects);
  }, [props.primaryObjects]);

  useEffect(() => {
    if(props.propertyId){
      updateDataTasks(props.propertyId);
    }
  }, [updateDataTasks, props.propertyId]);

  const saveLocation = React.useCallback((task, dataTransfer) => {
    var layer = objectRef.current[task.id].leafletElement;

    var point = dataTransfer.points;

    const data = {
      task:{
        ...task,
        point
      }
    }
    taskService.storeOrUpdateTasks(data, task.id).then(res => {
      if(res.code === '0000'){
        updateDataTasks(res.task.property_id)
        layer.editing.disable();
      }
    });

  }, [updateDataTasks]);

  const cancelSaveArea = React.useCallback((propertyId, dataObjectId) => {
    var layer = objectRef.current[dataObjectId].leafletElement;
    layer.editing.disable();
  }, []);

  useEffect(() => {
    if(saveSuccess && dataTransfer.type === 'task' && dataTask){
      saveLocation(dataTask, dataTransfer);
    } else if (cancelSave && dataTransfer.type === 'task'){
      cancelSaveArea(props.propertyId, dataTask.id);
    }
  }, [saveSuccess, saveLocation, dataTransfer, props.propertyId, cancelSave, dataTask, cancelSaveArea])

  const onSaved = (savedTask) => {
    let taskTmp = _.clone(tasks);
    const taskIndex = _.findIndex(taskTmp, (task) => {
      return task.id === savedTask.id
    });
    if(taskIndex === -1){
      taskTmp.push(savedTask);
    } else {
      taskTmp[taskIndex] = savedTask;
    }
    setTasks(taskTmp);
  }
  
  const handleShowTasks = (data) => {
    var html = [];
    if(data.length > 0){
      _.forEach(data, function(task){
        html.push(
          <Marker 
            key={task.id} 
            position={[task.lat, task.lng]} 
            icon={IconTask()}
            onClick={handleClickTask.bind(this, task)}
            onDragEnd={handleEditTask.bind(this, task)}
            onRemove={handleRemoveTask.bind(this, task)}
            ref={el => (objectRef.current[task.id] = el)}
          />
        );
      });
    }
    return html;
  }

  const handleClickTask = (object, e) => {
    //Not trigger anything if on deleted state
    if(!props.controlDraw.current.leafletElement._toolbars.edit._modes.remove.handler._enabled){
      const modalData = {
        object,
        type: 'task'
      }
      dispatch(openModal(modalData));
    }
  }

  const handleRemoveTask = (object, e) => {
    props.handleSetDeletedTasks(object.id);    
  }

  const handleEditTask = (object, e) => {
    let LatLng = e.target.getLatLng();
    object.lat = LatLng.lat;
    object.lng = LatLng.lng;
    props.handeSetUpdatedTasks(object, LatLng);
  }

  const editLocation = () => {
    const data = {
      objectRef,
      dataId: modalData.object.id,
      type: 'task'
    }
    dispatch(show(data));
    setDataTask(modalData.object);
    objectRef.current[modalData.object.id].leafletElement.editing.enable();
  }

  return (
    <>
      {handleShowTasks(tasks)}
      <TaskModal
        updateDataTasks={updateDataTasks}
        propertyId={props.propertyId}
        primaryObjects={primaryObjects}
        onSaved={onSaved}
        editLocation={editLocation}
      />
    </>
  );
}

export default Task;
