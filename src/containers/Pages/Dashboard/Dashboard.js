import React, { useState, useEffect } from 'react';
import LayoutWrapper from '@iso/components/utility/layoutWrapper.js';
import Box from '@iso/components/utility/box';
import PageHeader from '@iso/components/utility/pageHeader';
import IntlMessages from '@iso/components/utility/intlMessages';
import { useSelector } from 'react-redux';
import { propertyService } from '@iso/services';

const BlankPage = () => {
  const activePropertyId = useSelector((state) => state.property.activePropertyId);
  const [property, setProperty] = useState({});

  useEffect(() => {
    if(activePropertyId){
      propertyService.viewProperty(activePropertyId).then(res => {
        if(res.code === '0000'){
          setProperty(res.property);
        }
      });
    }
  }, [activePropertyId]);

  return (
    <LayoutWrapper>
      <PageHeader>
        {<IntlMessages id="propertyPage.dashboard.header"/>}
      </PageHeader>
      <Box>
        <h1>Name: {property ? property.name : ''}</h1>
        <h1>Number: {property ? property.number : ''}</h1>
      </Box>
    </LayoutWrapper>
  );
}

export default BlankPage;
