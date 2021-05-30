import React from 'react';
import { useDispatch } from 'react-redux';
import Popover from '@iso/components/uielements/popover';
import IntlMessages from '@iso/components/utility/intlMessages';
import userpic from '@iso/assets/images/user1.png';
import authAction from '@iso/redux/auth/actions';
import TopbarDropdownWrapper from './TopbarDropdown.styles';
import TopbarProfileModal from './TopbarProfileModal';

const { logout } = authAction;

export default function TopbarUser() {
  const [visible, setVisibility] = React.useState(false);
  const [visibleProfile, setVisibilityProfile] = React.useState(false);
  const [editProfile, setEditProfile] = React.useState({});
  const dispatch = useDispatch();

  function handleVisibleChange() {
    setVisibility(visible => !visible);
  }

  const showModal = () => {
    setVisibilityProfile(true);
    setVisibility(visible => !visible);
  }

  const cancelModal = () => {
    setVisibilityProfile(false);
    //setEditProperty({});
  }

  const content = (
    <TopbarDropdownWrapper className="isoUserDropdown">
      <a className="isoDropdownLink" onClick={showModal}>
        <IntlMessages id="topbar.myprofile" />
      </a>
      <a className="isoDropdownLink" href="# ">
        <IntlMessages id="themeSwitcher.settings" />
      </a>
      <a className="isoDropdownLink" href="# ">
        <IntlMessages id="sidebar.feedback" />
      </a>
      <a className="isoDropdownLink" href="# ">
        <IntlMessages id="topbar.help" />
      </a>
      <div className="isoDropdownLink" onClick={() => dispatch(logout())}>
        <IntlMessages id="topbar.logout" />
      </div>
      <TopbarProfileModal editProfile={editProfile} visibleProfile={visibleProfile} cancelModal={cancelModal}/>
    </TopbarDropdownWrapper>
    
  );



  return (
    <Popover
      content={content}
      trigger="click"
      visible={visible}
      onVisibleChange={handleVisibleChange}
      arrowPointAtCenter={true}
      placement="bottomLeft"
    >
      <div className="isoImgWrapper">
        <img alt="user" src={userpic} />
        <span className="userActivity online" />
      </div>
    </Popover>
  );
}
