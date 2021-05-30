import moment from 'moment';

export const commonHelper = {
  convertUtcToLocalDate: (date, format) => {
    let utcDate = moment.utc(new Date(date));
    return moment(utcDate).local().format(format);
  },
}