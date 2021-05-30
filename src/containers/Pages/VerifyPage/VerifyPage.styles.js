import styled from 'styled-components';
import bgImage from '@iso/assets/images/image6.jpg';
import WithDirection from '@iso/lib/helpers/rtl';

const VerifyPageWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: url(${bgImage}) no-repeat center center;
  background-size: cover;

  h1{
    color: #ffffff
  }
`;

export default WithDirection(VerifyPageWrapper);