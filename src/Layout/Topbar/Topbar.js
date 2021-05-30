import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Layout } from 'antd';
import appActions from '@iso/redux/app/actions';
import TopbarUser from './TopbarUser';
import TopbarWrapper from './Topbar.styles';
import TopbarSearch from './TopbarSearch';
import IntlMessages from '@iso/components/utility/intlMessages';

const { Header } = Layout;
const { toggleCollapsed, toggleChangeText } = appActions;

export default function Topbar() {
  //const [isToggle, setIsToggle] = React.useState(false);
  const [,setSelectedItem] = React.useState('');
  
  const customizedTheme = useSelector(state => state.ThemeSwitcher.topbarTheme);
  const textTopbar = useSelector(state=>state.App.textTopBar);
  const { collapsed, openDrawer } = useSelector(state => state.App);

  const dispatch = useDispatch();

  const handleToggle = React.useCallback(() => {
    dispatch(toggleCollapsed());
    dispatch(toggleChangeText());
  },[dispatch]);
  const isCollapsed = collapsed && !openDrawer;
  const styling = {
    background: customizedTheme.backgroundColor,
    position: 'fixed',
    width: '100%',
    height: 70,
  };

  const isMap = window.location.pathname.split('/').slice(-1)[0] == "map";

  return (
    <TopbarWrapper>
      <Header
        style={styling}
        className={
          isCollapsed ? 'isomorphicTopbar collapsed' : 'isomorphicTopbar'
        }
      >
        <div className="isoLeft">
          <button
            className={
              isCollapsed ? 'triggerBtn menuCollapsed' : 'triggerBtn menuOpen'
            }
            style={{ color: customizedTheme.textColor }}
            onClick={handleToggle}
          />

          {isMap && textTopbar && <IntlMessages id="propertyMapPage.header" /> }
        </div>

        <ul className="isoRight">
          <li className="isoSearch">
            <TopbarSearch />
          </li>
          <li onClick={() => setSelectedItem('user')} className="isoUser">
            <TopbarUser />
          </li>
        </ul>
      </Header>
    </TopbarWrapper>
  );
}
