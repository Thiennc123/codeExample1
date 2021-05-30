import { commonHelper } from './commonHelper';

export const dateHelper = {
  dateForAPI: (date) => {
    return commonHelper.convertUtcToLocalDate(date, 'YYYY-MM-DD');
  },
}