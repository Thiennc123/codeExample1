import styled from 'styled-components';
import WithDirection from '@iso/lib/helpers/rtl';

const MobManagePage = styled.div`
  width: 100%;
  height: 100%;
  .btn-success{
    background-color: #65bb38;
    border-color: #559f2f;
  }
  .button-group{
    width: 100%;
    margin-bottom: 10px;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
  }
`;

export default WithDirection(MobManagePage);