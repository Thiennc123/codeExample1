import _ from 'lodash';

export function options(properties, activeId = null) {
  const options = [
    {
      key: 'manage-properties',
      label: 'sidebar.manageProperties',
      leftIcon: 'ion-document',
    },
    {
      key: 'map',
      label: 'sidebar.propertyMap',
      leftIcon: 'ion-location',
    },
    {
      key: 'manage-mobs',
      label: 'sidebar.manageMobs',
      leftIcon: 'ion-document',
    },
    {
      key: 'manage-tasks',
      label: 'sidebar.manageTasks',
      leftIcon: 'ion-document',
    }
  ];

  if(activeId){
    var indexActive = _.findIndex(properties, (property) => {
      return property.id === activeId;
    })

    if(properties.length > 0 && indexActive !== -1){
      options.unshift(
        {
          key: 'dashboard',
          label: properties[indexActive].name,
          leftIcon: 'ion-arrow-graph-up-right',
        },
      );
    }
  } else {
    if(properties.length > 0 && properties[0]){
      const activeProperty = JSON.parse(localStorage.getItem('active_property'));
      if(activeProperty){
        options.unshift(
          {
            key: 'dashboard',
            label: activeProperty.name,
            leftIcon: 'ion-arrow-graph-up-right',
          },
        );
      } else {
        localStorage.setItem('active_property', JSON.stringify(properties[0]));
        options.unshift(
          {
            key: 'dashboard',
            label: properties[0].name,
            leftIcon: 'ion-arrow-graph-up-right',
          },
        );
      }
    }
  }
  return options;
}
