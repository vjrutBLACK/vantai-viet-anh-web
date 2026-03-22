import type { TableProps } from 'antd';
import { Table } from 'antd';

export type DataTableProps<RecordType> = TableProps<RecordType> & {
  loading?: boolean;
};

export function DataTable<RecordType extends object>({
  loading,
  ...rest
}: DataTableProps<RecordType>) {
  return (
    <Table
      size="middle"
      bordered
      scroll={{ x: true }}
      loading={loading}
      pagination={{
        showSizeChanger: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}`,
        ...(typeof rest.pagination === 'object' ? rest.pagination : {}),
      }}
      {...rest}
    />
  );
}

