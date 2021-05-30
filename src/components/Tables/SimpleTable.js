import React from 'react';
import TableWrapper from './AntTables.styles';

export default function(props) {
  const dataSource = props.dataList.getAll();
  const columns = props.columns;
  const pagination = props.pagination;
  return (
    <TableWrapper
      pagination={pagination}
      columns={columns}
      dataSource={dataSource}
      className="isoSimpleTable"
    />
  );
}
