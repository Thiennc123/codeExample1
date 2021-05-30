import styled from 'styled-components';
import Modal from '@iso/components/Feedback/Modal';
import WithDirection from '@iso/lib/helpers/rtl';

const MobModalWrapper = styled(Modal)`
  .btn-success{
    background-color: #65bb38;
    border-color: #559f2f;
    &:hover{
      opacity: 0.8;
    }
  }
  .ant-modal-body{
    padding: 0;
  }
  .form-title{
    padding: 16px 24px;
    border-bottom: 1px solid #eaeef1;
    h3{
      font-size: 1rem;
    }
  }
  .form-body{
    padding: 12px 24px 12px 24px;
    .checkbox-contact{
      margin-bottom: 10px;
    }
  }
  &.mob-cannot-create .ant-btn-primary{
    display: none;
  }
  .btn-create-breed{
    background-color: #46AFCA;
    border-color: #46AFCA;
    &:hover{
      opacity: 0.8;
    }
    margin-top:30px;
    width: 100%;
    padding: 0;
  }
`;

export default WithDirection(MobModalWrapper);