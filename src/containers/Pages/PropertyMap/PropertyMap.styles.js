import styled from 'styled-components';
import WithDirection from '@iso/lib/helpers/rtl';

const PropertyMapPage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .leaflet-container{
    height: 100%;
  }
  .btn-success{
    background-color: #65bb38;
    border-color: #559f2f;
    &:hover{
      opacity: 0.8;
    }
  }
  .button-group{
    width: 100%;
    margin-bottom: 10px;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
  }
  .isoComponentTitle{
    margin-bottom: 15px;
  }
  .isoLeftRightComponent{
    padding: 8px 24px;
    background: #fff;
    border-bottom: 1px solid #eaeef1;
  }
  path.primary-objects{
    stroke-width: 2;
    &:hover{
      fill-opacity: 0.4;
      stroke: #fff;
    }
  }
  .primary-objects-tooltip{
    background: transparent;
    color: white;
    font-weight: 600;
    border: none;
    box-shadow: none;
  }
  .custom-icon-marker{
    margin-left: -22px;
    margin-top: -60px;
    width: 44px;
    height: 60px;
  }
  a[title="Clear all layers"]{
    display: none;
  }
  .custom-icon-marker.mob.leaflet-marker-draggable {
    display: none; 
  }
  &.not-show-area .primary-objects {
    display: none; 
  }
  
  &.not-show-task .custom-icon-marker.task-marker {
    display: none; 
  }

  &.not-show-mob .custom-icon-marker.mob {
    display: none; 
  }
`;

export default WithDirection(PropertyMapPage);