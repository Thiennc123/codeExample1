import Dashboard from '@iso/containers/Pages/Dashboard/Dashboard';
import Property from '@iso/containers/Pages/Property/Property';
import PropertyMap from '@iso/containers/Pages/PropertyMap/PropertyMap';
import Mob from '@iso/containers/Pages/Mob/Mob';
import Task from '@iso/containers/Pages/Task/Task';

export default {
  Dashboard: {
    component: Dashboard,
    path: '/dashboard'
  },
  Property: {
    component: Property,
    path: '/manage-properties'
  },
  PropertyMap: {
    component: PropertyMap,
    path: '/map'
  },
  Mob: {
    component: Mob,
    path: '/manage-mobs'
  },
  Task: {
    component: Task,
    path: '/manage-tasks'
  }
};
