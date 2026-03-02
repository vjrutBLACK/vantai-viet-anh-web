import { ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { Button, Tag } from 'antd';
import { transactionsApi, type Transaction } from '@/api/transactions';
import dayjs from 'dayjs';

export default function TransactionsPage() {
  const columns: ProColumns<Transaction>[] = [
    { title: 'Mã GD', dataIndex: 'transactionCode', key: 'transactionCode', width: 100 },
    {
      title: 'Ngày',
      dataIndex: 'transactionDate',
      key: 'transactionDate',
      width: 110,
      render: (_, r) => r.transactionDate && dayjs(r.transactionDate).format('DD/MM/YYYY'),
    },
    {
      title: 'Loại',
      dataIndex: 'transactionType',
      key: 'transactionType',
      width: 80,
      render: (_, r) => (
        <Tag color={r.transactionType === 'income' ? 'green' : 'red'}>
          {r.transactionType === 'income' ? 'Thu' : 'Chi'}
        </Tag>
      ),
    },
    { title: 'Danh mục', dataIndex: 'category', key: 'category', width: 100 },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (_, r) => new Intl.NumberFormat('vi-VN').format(Number(r.amount)),
    },
    { title: 'Mô tả', dataIndex: 'description', key: 'description', ellipsis: true },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>Thu - Chi</h2>
      <ProTable<Transaction>
        columns={columns}
        request={async (params) => {
          const res = await transactionsApi.list({
            page: params.current,
            limit: params.pageSize,
          }) as { data: Transaction[]; pagination: { total: number } };
          return { data: res.data, total: res.pagination?.total ?? 0, success: true };
        }}
        rowKey="id"
        search={{ labelWidth: 'auto' }}
        pagination={{ pageSize: 20 }}
        toolBarRender={() => [<Button type="primary" key="add">Thêm giao dịch</Button>]}
      />
    </div>
  );
}
