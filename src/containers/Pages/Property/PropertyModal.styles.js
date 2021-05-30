import styled from 'styled-components';
import Modal from '@iso/components/Feedback/Modal';
import WithDirection from '@iso/lib/helpers/rtl';

const PropertyModalWrapper = styled(Modal)`
  &.user-access-modal{
    width: 640px !important;
  }
  .ant-modal-body{
    padding: 0;
  }
  .btn-success{
    background-color: #65bb38;
    border-color: #559f2f;
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
`;

export default WithDirection(PropertyModalWrapper);