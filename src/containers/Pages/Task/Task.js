import React,{ useState, useEffect } from 'react';
import LayoutWrapper from '@iso/components/utility/layoutWrapper.js';
import { useSelector, useDispatch } from 'react-redux';
import { taskService } from '@iso/services';
import TaskManagePage from './Task.styles';
import Board from 'react-trello';
import modalActions from '@iso/redux/modal/actions';
import TaskModal from './TaskModal';
import _ from 'lodash';

const { openModal } = modalActions;


const Task = () => {
  const activePropertyId = useSelector((state) => state.property.activePropertyId);
  const dispatch = useDispatch();
  const [modalVisibility, setModalVisibility] = React.useState(false);
  const [data, setData] = useState({
    lanes: [
      {
        id: 'todo',
        title: 'To Do',
        cards: [          
        ]
      },
      {
        id: 'underway',
        title: 'Underway',
        cards: [          
        ]
      },
      {
        id: 'completed',
        title: 'Completed',
        cards: [          
        ]
      },
    ]
  });

  
  useEffect(() => {
    if(activePropertyId){
       taskService.getBoard(activePropertyId).then(res => {
        if(res.code === '0000'){
          setData(res.data);
        }
      });
    }
  }, [activePropertyId]);
  
  const onCardDelete = (cardId, laneId) => {
    taskService.destroy(cardId);
  }

  const [moveTaskId, setMoveTaskId] = useState(null);
  const [moveLaneId, setMoveLaneId] = useState(null);

  const handleDragEnd = (cardId, sourceLaneId, targetLaneId, position, cardDetails) => {
    setMoveTaskId(cardId); 
    setMoveLaneId(targetLaneId); 
  }

  const onDataChange = (newData) => {
    if(moveTaskId && moveLaneId){
      let laneId = ["todo", "underway", "completed"].indexOf(moveLaneId);
      let tasks = newData.lanes[laneId].cards;
      let position = 0;
      _.forEach(tasks, function(task, key){
        if(task.id === moveTaskId){ 
          if(tasks.length == 1){
            position = 65536;
          }else if(tasks.length-1 == key){
            position = tasks[tasks.length-2].metadata.position + 65536;
          }else if(key==0){
            position = tasks[1].metadata.position/2;
          }else {
            position = (tasks[key-1].metadata.position + tasks[key+1].metadata.position)/2;
          }
          task.position = position;
          const data = {
            task: {
              status: moveLaneId,        
              position: position
            },          
          }
          taskService.changeStatus(data, moveTaskId);  
        return;
        }
      });
      setMoveTaskId(null);
      setMoveLaneId(null);
    }
    
  }
  
  const onCardAdd = (card, laneId) => {
    const data = {
      task: {
        title: card.title,
        details: card.description,
        status: laneId,
        property_id: activePropertyId,
        priority: 'medium'
      }
    }
    taskService.storeOrUpdateTasks(data, null).then(res => {
      if(res.code === '0000'){
        taskService.getBoard(activePropertyId).then(res => {
          if(res.code === '0000'){
            setData(res.data);
          }
        });
      }
    });
  }

  const onCardClick = (cardId, metadata, laneId) => {
      showModal(metadata, laneId);
      
  }

  const showModal = (task, laneId) => {
    const modalData = {
        task,
        type: 'task',
        laneId
    }
    dispatch(openModal(modalData));
  }

  const onSaved = () => {
    if(activePropertyId){
      taskService.getBoard(activePropertyId).then(res => {
        if(res.code === '0000'){
          setData(res.data);
        }
      });      
    }
  }

  return(
    <LayoutWrapper>
      <TaskManagePage>
        <Board 
        editable={true}
        data={data} 
        onCardDelete={onCardDelete}
        handleDragEnd={handleDragEnd}
        onCardAdd={onCardAdd}
        onCardClick={onCardClick}
        onDataChange={onDataChange}
        />
      </TaskManagePage>
      <TaskModal
      propertyId={activePropertyId} 
      onSaved={onSaved}
      /> 
    </LayoutWrapper>
  )
}

export default Task;