import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';

const InjectMassage = props => { 
  const stringExists = !!props.intl.messages[props.id]; 
  if(stringExists){
    return <FormattedMessage {...props} />;
  } else {
    return props.id;
  }
}
export default injectIntl(InjectMassage, {
  withRef: false,
});
