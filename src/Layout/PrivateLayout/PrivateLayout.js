import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Layout } from 'antd';
import useWindowSize from '@iso/lib/hooks/useWindowSize';
import appActions from '@iso/redux/app/actions';
import propertyActions from '@iso/redux/property/actions';
import permissionActions from '@iso/redux/permission/actions';
import siteConfig from '@iso/config/site.config';
import Sidebar from '../Sidebar/Sidebar';
import Topbar from '../Topbar/Topbar';
import { DashboardContainer, DashboardGlobalStyles } from './Dashboard.styles';
import { loadScript } from '@iso/lib/helpers/googleApiHelper';

const { Content, Footer } = Layout;
const { toggleAll } = appActions;
const { changeActiveProperty, loadProperties } = propertyActions;
const { store } = permissionActions;

const styles = {
  layout: { flexDirection: 'row', overflowX: 'hidden' },
  content: {
    padding: '70px 0 0',
    flexShrink: '0',
    background: '#f1f3f6',
    position: 'relative',
  },
  footer: {
    background: '#ffffff',
    textAlign: 'center',
    borderTop: '1px solid #ededed',
  },
};

export default function PrivateLayout(props) {
  const dispatch = useDispatch();
  const appHeight = useSelector(state => state.App.height);
  const { width, height } = useWindowSize();

  React.useEffect(() => {
    dispatch(toggleAll(width, height));
  }, [width, height, dispatch]);

  React.useEffect(() => {
    dispatch(loadProperties(() => {
      const activeProperty = JSON.parse(localStorage.getItem('active_property'));
      if(activeProperty){
        dispatch(changeActiveProperty(activeProperty.id));
      }
    }));
    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&libraries=places`
    );
  }, [dispatch]);

  const isMap = window.location.pathname.split('/').slice(-1)[0] == "map";

  React.useEffect(() => {
    dispatch(store());
  });

  return (
    <DashboardContainer>
      <DashboardGlobalStyles />
      <Layout style={{ height: height }}>
        <Topbar />
        <Layout style={styles.layout}>
          <Sidebar />
          <Layout
            className="isoContentMainLayout"
            style={{
              height: appHeight,
            }}
          >
            <Content className="isomorphicContent" style={styles.content}>
              {props.children}
            </Content>
            {!isMap &&<Footer style={styles.footer}>{siteConfig.footerText}</Footer>}
          </Layout>
        </Layout>
      </Layout>
    </DashboardContainer>
  );
}
