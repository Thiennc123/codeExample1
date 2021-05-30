import React from 'react';
import LayoutWrapper from '@iso/components/utility/layoutWrapper.js';
import Box from '@iso/components/utility/box';
import PageHeader from '@iso/components/utility/pageHeader';
import IntlMessages from '@iso/components/utility/intlMessages';
import { useSelector, useDispatch } from 'react-redux';
import SimpleTable from '@iso/components/Tables/SimpleTable';
import fakeData from '@iso/components/Tables/data';
import { configs } from '@iso/components/Tables/configs';
import { Button, Dropdown, Menu } from 'antd';
import PropertyManagePage from './Property.styles';
import { PlusOutlined, DownOutlined, EditOutlined, CheckCircleOutlined, UserOutlined } from '@ant-design/icons';
import propertyActions from '@iso/redux/property/actions';
import PropertyModal from './PropertyModal';
import UserAccessModal from './UserAccessModal';

const { changeActiveProperty } = propertyActions;

const Property = () => {
  const dispatch = useDispatch();
  const properties = useSelector((state) => state.property.properties);
  const activePropertyId = useSelector((state) => state.property.activePropertyId);
  const dataList = new fakeData(properties.length, properties);
  const [visible, setVisiblity] = React.useState(false);
  const [visibleUserAccess, setVisibleUserAccess] = React.useState(false);
  const [editProperty, setEditProperty] = React.useState({});
  const [propertyId, setPropertyId] = React.useState('');

  const handleMenuClick = (property, e) => {
    if (e.key === 'editStatus') {
      localStorage.setItem('active_property', JSON.stringify(property));
      dispatch(changeActiveProperty(property.id));
    }
    if (e.key === 'editDetails') {
      setVisiblity(true);
      setEditProperty(property);
    }
    if (e.key === 'userAccess') {
      setVisibleUserAccess(true);
      setPropertyId(property.id);
    }
  }

  const showModal = () => {
    setVisiblity(true);
  }

  const cancelModal = () => {
    setVisiblity(false);
    setEditProperty({});
  }

  const cancelUserAccessModal = () => {
    setVisibleUserAccess(false);
    setPropertyId('');
  }

  const menu = (property) => (
    <Menu onClick={handleMenuClick.bind(this, property)}>
      <Menu.Item key="editDetails" icon={<EditOutlined />}>
        <IntlMessages id="propertyPage.managePage.editDetails" />
      </Menu.Item>
      <Menu.Item key="userAccess" icon={<UserOutlined />}>
        <IntlMessages id="propertyPage.managePage.userAccess" />
      </Menu.Item>
      <Menu.Item key="editStatus" icon={<CheckCircleOutlined />}>
        <IntlMessages id="propertyPage.managePage.active" />
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: <IntlMessages id="antTable.title.property" />,
      key: 'name',
      width: 100,
      render: property => {
        return (
          <div>
            {configs.renderCell(property, 'TextCell', 'name')}
            {
              activePropertyId === property.id &&
              <CheckCircleOutlined />
            }
          </div>
        );
      },
    },
    {
      title: <IntlMessages id="antTable.title.address" />,
      key: 'address',
      width: 100,
      render: property => configs.renderCell(property, 'TextCell', 'address'),
    },
    {
      title: <IntlMessages id="antTable.title.actions" />,
      key: 'actions',
      width: 100,
      render: property => {
        return (
          <Dropdown overlay={menu(property)} trigger={['click']}>
            <Button>
              <IntlMessages id="propertyPage.managePage.edit" /> <DownOutlined />
            </Button>
          </Dropdown>
        );
      },
    },
  ];

  return (
    <LayoutWrapper>
      <PropertyManagePage>
        <PageHeader>
          {<IntlMessages id="propertyPage.managePage.header" />}
        </PageHeader>
        <div className="button-group">
          <Button icon={<PlusOutlined />} type="primary" className="btn-success" onClick={showModal}>
            <IntlMessages id="propertyPage.managePage.addProperty" />
          </Button>
        </div>
        <Box>
          {
            properties.length > 0 &&
            <SimpleTable columns={columns} dataList={dataList} pagination={{ pageSize: 5 }} />
          }
        </Box>
        <PropertyModal editProperty={editProperty} visible={visible} cancelModal={cancelModal} />
        <UserAccessModal visible={visibleUserAccess} propertyId={propertyId} cancelModal={cancelUserAccessModal} />
      </PropertyManagePage>
    </LayoutWrapper>
  );
}

export default Property;
