import React,{ useState, useEffect } from 'react';
import LayoutWrapper from '@iso/components/utility/layoutWrapper.js';
import Box from '@iso/components/utility/box';
import PageHeader from '@iso/components/utility/pageHeader';
import IntlMessages from '@iso/components/utility/intlMessages';
import { useSelector, useDispatch } from 'react-redux';
import SimpleTable from '@iso/components/Tables/SimpleTable';
import fakeData from '@iso/components/Tables/data';
import { configs } from '@iso/components/Tables/configs';
import { Button, Dropdown, Menu } from 'antd';
import MobManagePage from './Mob.styles';
import { PlusOutlined, DownOutlined, EditOutlined } from '@ant-design/icons';
import { mobService } from '@iso/services';
import modalActions from '@iso/redux/modal/actions';
import MobModal from './MobModal';
import _ from 'lodash';

const { openModal } = modalActions;

const Mob = () => {
  const dispatch = useDispatch();
  const [mobs, setMobs] = useState({});
  const activePropertyId = useSelector((state) => state.property.activePropertyId);
  
  useEffect(() => {
  }, [mobs]);

  useEffect(() => {
    if(activePropertyId){
       mobService.getList(activePropertyId).then(res => {
        if(res.code === '0000'){
          setMobs(res.mobs);
        }
      });
    }
  }, [activePropertyId]);

  
  const handleMenuClick = (mob, e) => {
    if(e.key === 'editDetails'){
      showModal(mob);
    }
  }

  const showModal = (mob) => {
      const modalData = {
        mob,
        type: 'mob',
        canCreate: true
      }
      dispatch(openModal(modalData));
  }

  const menu = (mob) => (
    <Menu onClick={handleMenuClick.bind(this, mob)}>
      <Menu.Item key="editDetails" icon={<EditOutlined />}>
        <IntlMessages id="propertyPage.managePage.editDetails" />
      </Menu.Item>
    </Menu>
  );

  const onSaved = (savedMob) => {
    let mobTmp = _.clone(mobs);
    const mobIndex = _.findIndex(mobTmp, (mob) => {
      return mob.id === savedMob.id
    });
    if(mobIndex === -1){
      mobTmp.push(savedMob);
    } else {
      mobTmp[mobIndex] = savedMob;
    }
    setMobs(mobTmp);
  }

  const columns = [
    {
      title: <IntlMessages id="antTable.title.name" />,
      key: 'name',
      width: 100,
      render: mob => configs.renderCell(mob, 'TextCell', 'name'),
    },
    {
      title: <IntlMessages id="antTable.title.type" />,
      key: 'type',
      width: 100,
      render: mob => configs.renderCell(mob, 'TextCell', 'type'),
    },
    {
      title: <IntlMessages id="antTable.title.primary_object" />,
      key: 'primary_object_id',
      width: 100,
      render: mob => configs.renderCell(mob, 'TextCell', 'primary_object_id'),
    },
    {
      title: <IntlMessages id="antTable.title.tag_colour" />,
      key: 'tag_colour',
      width: 100,
      render: mob => configs.renderCell(mob, 'TextCell', 'tag_colour'),
    },
    {
      title: <IntlMessages id="antTable.title.tag_number_range" />,
      key: 'tag_number_range',
      width: 100,
      render: mob => configs.renderCell(mob, 'TextCell', 'tag_number_range'),
    },
    {
      title: <IntlMessages id="antTable.title.date_of_birth" />,
      key: 'date_of_birth',
      width: 100,
      render: mob => configs.renderCell(mob, 'TextCell', 'date_of_birth'),
    },
    {
      title: <IntlMessages id="antTable.title.breed" />,
      key: 'breed',
      width: 100,
      render: mob => configs.renderCell(mob, 'TextCell', 'breed'),
    },
    {
      title: <IntlMessages id="antTable.title.actions" />,
      key: 'actions',
      width: 100,
      render: mob => {
        return (
          <Dropdown overlay={menu(mob)} trigger={['click']}>
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
      <MobManagePage>
        <PageHeader>
          {<IntlMessages id="mobPage.managePage.header" />}
        </PageHeader>
        <div className="button-group">
          <Button icon={<PlusOutlined />} type="primary" className="btn-success" onClick={showModal}>
            <IntlMessages id="mobPage.managePage.addMob" />
          </Button>
        </div>
        <Box>
        {
          mobs.length > 0 &&
          <SimpleTable columns={columns} dataList={mobs ? new fakeData(mobs.length, mobs) : {} } pagination={{pageSize: 50}} />
        }
        </Box>
        <MobModal onSaved={onSaved} />
      </MobManagePage>
    </LayoutWrapper>
  );
}

export default Mob;
