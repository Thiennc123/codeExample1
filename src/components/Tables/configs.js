import {
  DateCell,
  ImageCell,
  LinkCell,
  TextCell,
} from '@iso/components/Tables/CellTables/HelperCells';

const configs = {
  renderCell: (object, type, key) => {
    const value = object[key];
    switch (type) {
      case 'ImageCell':
        return ImageCell(value);
      case 'DateCell':
        return DateCell(value);
      case 'LinkCell':
        return LinkCell(value);
      default:
        return TextCell(value);
    }
  }
}

export { configs };
