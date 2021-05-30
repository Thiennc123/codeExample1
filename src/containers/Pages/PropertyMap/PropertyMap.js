import React, { useState, useEffect } from 'react';
import LayoutWrapper from '@iso/components/utility/layoutWrapper.js';
import PageHeader from '@iso/components/utility/pageHeader';
import IntlMessages from '@iso/components/utility/intlMessages';
import PropertyMapPage from './PropertyMap.styles';
import { Map, TileLayer, FeatureGroup, Polygon, Tooltip } from 'react-leaflet';
import { PlusOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { propertyService } from '@iso/services';
import { Button, Dropdown, Menu } from 'antd';
import { EditControl } from "react-leaflet-draw";
import PrimaryObjectModal from './components/PrimaryObject/PrimaryObjectModal';
import _ from 'lodash';
import { objectColors } from '@iso/constants/objectColors';
import { taskService, mobService, primaryObjectService } from '@iso/services';
import { v4 as uuidv4 } from 'uuid';
import Task from './components/Task/Task';
import Mob from './components/Mob/Mob';
import BtnSaveGroup from './components/BtnSaveGroup/BtnSaveGroup';
import btnSaveAction from '@iso/redux/btnSave/actions';
import modalActions from '@iso/redux/modal/actions';
import inside from 'point-in-polygon';
import Control from '@skyeer/react-leaflet-custom-control'
import AppLocale from '@iso/config/translation';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { store } from '@iso/redux/store';

var geodesy = require('leaflet-geodesy');
const { show } = btnSaveAction;
const { openModal } = modalActions;

const PropertyMap = () => {
  const activePropertyId = useSelector((state) => state.property.activePropertyId);
  const [propertyId, setPropertyId] = useState(null);
  const btnVisibility = useSelector((state) => state.btnSave.btnVisibility);
  const saveSuccess = useSelector((state) => state.btnSave.saveSuccess);
  const cancelSave = useSelector((state) => state.btnSave.cancelSave);
  const dataTransfer = useSelector((state) => state.btnSave.data);
  const [position, setPosition] = useState([-33.865143, 151.209900]);
  const controlDraw = React.useRef(null);
  const objectRef = React.useRef([]);
  const [primaryObjects, setPrimaryObjects] = useState([]);
  const [editableFG, setEditableFG] = useState(null);
  const [currentLayer, setCurrentLayer] = useState(null);
  const [currentObject, setCurrentObject] = useState(null);
  const dispatch = useDispatch();
  const modalData = useSelector((state) => state.modal.modalData);
  const { locale } = useSelector(state => state.LanguageSwitcher.language);
  const currentAppLocale = AppLocale[locale];

  const updatePropertyDetail = React.useCallback((id) => {
    propertyService.viewProperty(id).then(res => {
      if(res.code === '0000'){
        setPosition([res.property.lat, res.property.lng]);
        setPrimaryObjects(res.primary_objects);
      }
    })
  }, []);

  const saveArea = React.useCallback((dataTransfer) => {
    var layer = objectRef.current[dataTransfer.dataId].leafletElement;

    var points = dataTransfer.points;
    var arrPoints = [];

    for (var point of points[0]) {
      arrPoints.push(Object.values(point));
    }

    var acreage = (geodesy.area(layer) / 10000).toFixed(2);

    var dataTmp = {
      primary_object:{
        data_area: _.map(arrPoints, (point) => {
          return point.slice(0, 2).toString().replace(',', ', ');
        }),
        acreage
      }
    }

    primaryObjectService.updateArea(dataTmp, dataTransfer.dataId).then(res => {
      if(res.code === '0000'){
        // updatePropertyDetail(activePropertyId);
        layer.editing.disable();
      }
    });
  }, []);

  const enableDrawing = React.useCallback((dataTransfer) => {
    if(currentObject){
      if(currentObject === 'addArea'){
        enableAction('draw', 'polygon');
      } else if(currentObject === 'addTask'){
        enableAction('draw', 'marker');
      } else if(currentObject === 'addMob'){
        enableAction('draw', 'marker');
      }
    }
  });

  useEffect(() => {
    if(currentObject){
      enableDrawing(currentObject);
    }
  },[currentObject]);

  const cancelSaveArea = React.useCallback((propertyId, dataObjectId) => {
    var layer = objectRef.current[dataObjectId].leafletElement;
    // updatePropertyDetail(propertyId);
    layer.editing.disable();
  }, []);

  useEffect(() => {
    if(activePropertyId){
      setPropertyId(activePropertyId);
      updatePropertyDetail(activePropertyId);
    }    
  }, [activePropertyId, updatePropertyDetail]);

  useEffect(() => {
    if(saveSuccess && dataTransfer.type === 'area'){
      saveArea(dataTransfer);
    } else if (cancelSave && dataTransfer.type === 'area'){
      cancelSaveArea(propertyId, dataTransfer.dataId);
    }
  }, [saveSuccess, saveArea, cancelSave, cancelSaveArea, propertyId, dataTransfer])

  const onEdited = (editedObject) => {
    const objectTmp = _.map(primaryObjects, (object) => {
      if(object.id === editedObject.id){
        return editedObject;
      }
      return object;
    })
    setPrimaryObjects(objectTmp)
  }

  const menu = () => (
    <Menu onClick={handleMenuClick.bind(this)} style={{width: '150px'}}>
      <Menu.Item key="addArea">
        <IntlMessages id="propertyMapPage.area" />
      </Menu.Item>
      <Menu.Item key="addTask">
        <IntlMessages id="propertyMapPage.task" />
      </Menu.Item>
      <Menu.Item key="addMob">
        <IntlMessages id="propertyMapPage.mob" />
      </Menu.Item>
    </Menu>
  );

  const enableAction = (actionType, value) => {
    controlDraw.current.leafletElement._toolbars[actionType]._modes[value].handler.enable();
  }

  const handleMenuClick = (e) => {
    setCurrentObject(e.key);
    if(e.key === 'addArea'){
      enableAction('draw', 'polygon');
    } else if(e.key === 'addTask'){
      enableAction('draw', 'marker');
    } else if(e.key === 'addMob'){
      var layer = null;
      var type = 'mob';
      var point = null;
      var canCreate = false;
      const modalData = {
        featureGroup: editableFG,
        layer,
        type,
        canCreate,
        object:{
          point
        }
      }
      dispatch(openModal(modalData));
      }
  }

  const onCreated = drawControl => {
    var type = drawControl.layerType,
    layer = drawControl.layer;
    setCurrentLayer(layer);
    console.log(layer);
    if (type === 'polygon') {
      handlePolygon(layer);
    } else if(type === 'marker'){
      handleMarker(layer);
    }
  }

  const handleMarker = (layer) => {
    let type = "";
    let canCreate = true;
    type = "task";

    var point = layer.getLatLng();
    const modalData = {
      featureGroup: editableFG,
      layer,
      type,
      canCreate,
      object:{
        point
      }
    }
    dispatch(openModal(modalData));
  }

  const handlePolygon = (layer) => {
    var points = layer.getLatLngs();
    var arrPoints = [];

    for (var point of points[0]) {
      arrPoints.push(Object.values(point));
    }

    var acreage = (geodesy.area(layer) / 10000).toFixed(2);

    const modalData = {
      featureGroup: editableFG,
      layer,
      type: 'area',
      object:{
        coordinates: arrPoints,
        acreage
      }
    }
    dispatch(openModal(modalData));
  }

  const onFeatureGroupReady = reactFGref => {
    // store the featureGroup ref for future access to content
    setEditableFG(reactFGref);
  };

  const handleShowPrimaryObjects = (objects) => {
    var html = [];
    if(objects.length > 0){
      _.forEach(objects, function(object){
        const colorIndex = _.findIndex(objectColors, (color) => {
          return color.value === object.color
        });

        html.push(
          <Polygon key={object.id}
            positions={object.area}
            onClick={handleClickObject.bind(this, object)}
            onRemove={handleRemoveObject.bind(this, object)}
            onEdit={handleEditObject.bind(this, object)}
            color={objectColors[colorIndex].color}
            className='primary-objects'
            ref={el => (objectRef.current[object.id] = el)}
          >
            <Tooltip permanent={true} direction="center" className='primary-objects-tooltip'>{object.name}</Tooltip>
          </Polygon>
        );
      });
    }
    return html;
  }

  const handleClickObject = (object, e) => {
    if(!controlDraw.current.leafletElement._toolbars.edit._modes.remove.handler._enabled){
      if(!btnVisibility){ 
        const modalData = {
          object,
          type: 'area'
        }
        dispatch(openModal(modalData));
      }
    }
  }

  const [deletedObjs, setDeletedObjs] = useState([]);
  const handleRemoveObject = (object, e) => {
    deletedObjs.push(object.id);
    setDeletedObjs(deletedObjs);
  }

  const [updatedObjs, setUpdatedObjs] = useState({});
  const handleEditObject = (object, e) => {
    let LatLngs = e.target.getLatLngs()[0];
    
    let area = _.map(LatLngs, (point) => {
      return [point.lat, point.lng];
    });
    let area2 = _.map(LatLngs, (point) => {
      return point.lat + ", " + point.lng;
    });

    object.area = area;
    updatedObjs[object.id] = area2;
    setUpdatedObjs(updatedObjs);
  }

  const editArea = () => {
    const data = {
      objectRef,
      dataId: modalData.object.id,
      type: 'area'
    }
    dispatch(show(data));
    objectRef.current[modalData.object.id].leafletElement.editing.enable();
  }

  const onTest = () => {
    console.log(objectRef);
  }

  const onMapDeleted = (e) => {
    _.forEach(deletedMobs, function(mobId){
      mobService.destroy(mobId);
    });   
    setDeletedMobs([]); 

    _.forEach(deletedTasks, function(taskId){
      taskService.destroy(taskId);
    });   
    setDeletedTasks([]);

    _.forEach(deletedObjs, function(objectId){
      primaryObjectService.destroy(objectId);
    });  
    setDeletedObjs([]); 
  }

  const [deletedMobs, setDeletedMobs] = useState([]);
  const handleSetDeletedMobs = (mobId) => {
    deletedMobs.push(mobId);
    setDeletedMobs(deletedMobs);
  }

  const [deletedTasks, setDeletedTasks] = useState([]);
  const handleSetDeletedTasks = (taskId) => {
    deletedTasks.push(taskId);
    setDeletedTasks(deletedTasks);
  }

  const onMapEdited = (e) => {
    _.forEach(updatedTasks, function(taskData, taskId){
      const data = {
        task: taskData
      }
      taskService.storeOrUpdateTasks(data, taskId);
    });     
    setUpdatedTasks({});

    _.forEach(updatedObjs, function(dataArea, objectId){
      const data = {
        primary_object: {
          data_area: dataArea
        }
      }
      primaryObjectService.updateArea(data, objectId)
    });   

    setUpdatedObjs({});  
  }

  const [updatedTasks, setUpdatedTasks] = useState({});
  const handeSetUpdatedTasks = (task, LatLng) => {
    updatedTasks[task.id] = {
      ...task,
      point: LatLng
    }
    setUpdatedTasks(updatedTasks);
  }

  const [showArea, setShowArea] = useState(true);
  const [showTask, setShowTask] = useState(true);
  const [showMob, setShowMob] = useState(true);

  return (
    <LayoutWrapper style={{height: '100%', paddingBottom: '0'}}>
      <PropertyMapPage className={`${showArea ? "" : "not-show-area"} ${showTask ? "" : "not-show-task"} ${showMob ? "" : "not-show-mob"}`} >
        <Map center={position} zoom={13} minZoom={13} maxZoom={18} zoomControl={false}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />
          <FeatureGroup
            ref={featureGroupRef => {
                onFeatureGroupReady(featureGroupRef);
            }}
          >
            <Control position="topleft">
              <IntlProvider
                locale={currentAppLocale.locale}
                messages={currentAppLocale.messages}
              >
                <input type="checkbox" checked={showArea} onChange={() => setShowArea(!showArea)} id='show-area'/> 
                <label htmlFor="show-area">
                  <IntlMessages id="propertyMapPage.showArea" />
                </label> &nbsp; 
                
                <input type="checkbox" checked={showTask} onChange={() => setShowTask(!showTask)} id='show-task'/> 
                <label htmlFor="show-task">
                  <IntlMessages id="propertyMapPage.showTask" />
                </label> &nbsp; 
                
                <input type="checkbox" checked={showMob}  onChange={() => setShowMob(!showMob)}   id='show-mob'/> 
                <label htmlFor="show-mob">
                  <IntlMessages id="propertyMapPage.showMob" />
                </label> &nbsp; 
              </IntlProvider>
            </Control>

            <Control position="bottomright">
              <Provider store={store}>
              <IntlProvider
                locale={currentAppLocale.locale}
                messages={currentAppLocale.messages}
              >
              <div className="leftComponent">
                <Dropdown overlay={menu()} trigger={['click']}>
                  <Button icon={<PlusOutlined />} type="primary" className="btn-success">
                    <IntlMessages id="propertyMapPage.add" />
                  </Button>
                </Dropdown>

                {
                  btnVisibility &&
                  <BtnSaveGroup />
                }
              </div>                            
              </IntlProvider>
              </Provider>
            </Control>
            
            <EditControl
              position='topleft'
              onCreated={onCreated}
              onEdited={onMapEdited}
              onDeleted={onMapDeleted}
              draw={{
                marker: true,
                polyline: false,
                circle: false,
                circlemarker: false,
                rectangle: false,
                polygon: {
                  allowIntersection: false,
                  showArea: true
                }
              }}
              ref={controlDraw}
              key={uuidv4()}
            />

            { handleShowPrimaryObjects(primaryObjects) }

            <Task
              propertyId={propertyId}
              currentLayer={currentLayer}
              primaryObjects={primaryObjects}
              controlDraw={controlDraw}
              updatePropertyDetail={updatePropertyDetail}
              handleSetDeletedTasks={handleSetDeletedTasks}
              handeSetUpdatedTasks={handeSetUpdatedTasks}
            />

            <Mob
              propertyId={propertyId}
              controlDraw={controlDraw}
              handleSetDeletedMobs={handleSetDeletedMobs}
              primaryObjects={primaryObjects}
            />

          </FeatureGroup>
        </Map>
        <PrimaryObjectModal 
          propertyId={propertyId} 
          updatePropertyDetail={updatePropertyDetail}
          editArea={editArea}
          onEdited={onEdited}
        />
      </PropertyMapPage>
    </LayoutWrapper>
  );
}

export default PropertyMap;
