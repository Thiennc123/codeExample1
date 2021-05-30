import styled from 'styled-components';
import { palette } from 'styled-theme';
import WithDirection from '@iso/lib/helpers/rtl';
import { handleShowRandomImage } from '@iso/constants/randomBackgrounds';

const ResendEmailConfirmStyleWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  height: 100vh;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: relative;
  background: url(${handleShowRandomImage}) no-repeat center center;
  background-size: cover;

  .ant-btn-primary.btn-success{
    background-color: #65bb38;
    border-color: #559f2f;
    &:hover{
      opacity: 0.8;
    }
  }


  &:before {
    content: '';
    width: 100%;
    height: 100%;
    display: flex;
    background-color: rgba(0, 0, 0, 0.2);
    position: absolute;
    z-index: 1;
    top: 0;
    left: ${props => (props['data-rtl'] === 'rtl' ? 'inherit' : '0')};
    right: ${props => (props['data-rtl'] === 'rtl' ? '0' : 'inherit')};
  }

  .isoFormContentWrapper {
    width: 500px;
    height: 100%;
    overflow-y: auto;
    z-index: 10;
    position: relative;
  }

  .isoFormContent {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 70px 50px;
    position: relative;
    background-color: #ffffff;

    @media only screen and (max-width: 767px) {
      width: 100%;
      padding: 70px 20px;
    }

    .isoLogoWrapper {
      width: 100%;
      display: flex;
      margin-bottom: 70px;
      justify-content: center;

      a {
        font-size: 24px;
        font-weight: 300;
        line-height: 1;
        text-transform: uppercase;
        color: ${palette('secondary', 2)};
      }
    }

    .isoFormHeadText {
      width: 100%;
      display: flex;
      flex-direction: column;
      margin-bottom: 15px;
      justify-content: center;

      h3 {
        font-size: 14px;
        font-weight: 500;
        line-height: 1.2;
        margin: 0 0 7px;
        color: ${palette('text', 0)};
      }

      p {
        font-size: 13px;
        font-weight: 400;
        line-height: 1.2;
        margin: 0;
        color: ${palette('text', 2)};
      }
    }

    .isoForgotPassForm {
      width: 100%;
      display: flex;
      flex-shrink: 0;
      flex-direction: column;

      .isoHelperWrapper {
        margin-top: 35px;
        flex-direction: column;
      }

      .isoForgotPass {
        font-size: 12px;
        color: ${palette('text', 3)};
        margin-bottom: 10px;
        text-decoration: none;

        &:hover {
          color: ${palette('primary', 0)};
        }
      }

      .isoInputWrapper {
        margin-bottom: 10px;

        &:last-child {
          margin-bottom: 0;
        }

        input {
          &::-webkit-input-placeholder {
            color: ${palette('grayscale', 0)};
          }

          &:-moz-placeholder {
            color: ${palette('grayscale', 0)};
          }

          &::-moz-placeholder {
            color: ${palette('grayscale', 0)};
          }
          &:-ms-input-placeholder {
            color: ${palette('grayscale', 0)};
          }
        }

        button {
          height: 42px;
          width: 100%;
          font-weight: 500;
          font-size: 13px;
        }
      }
    }
  }
`;

export default WithDirection(ResendEmailConfirmStyleWrapper);
