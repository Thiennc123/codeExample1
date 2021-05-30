import { combineReducers } from 'redux';
import App from '@iso/redux/app/reducer';
import Auth from '@iso/redux/auth/reducer';
import ThemeSwitcher from '@iso/redux/themeSwitcher/reducer';
import LanguageSwitcher from '@iso/redux/languageSwitcher/reducer';
import modal from '@iso/redux/modal/reducer';
import property from '@iso/redux/property/reducer';
import user from '@iso/redux/user/reducer';
import permission from '@iso/redux/permission/reducer';
import btnSave from '@iso/redux/btnSave/reducer';

export default combineReducers({
  Auth,
  App,
  ThemeSwitcher,
  LanguageSwitcher,
  modal,
  property,
  user,
  permission,
  btnSave,
});
