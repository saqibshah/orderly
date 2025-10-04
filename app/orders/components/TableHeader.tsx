import { Table } from "@radix-ui/themes";

const TableHeader = () => {
  return (
    <Table.Header>
      <Table.Row>
        <Table.ColumnHeaderCell>Tracking</Table.ColumnHeaderCell>
        <Table.ColumnHeaderCell>Courier Status</Table.ColumnHeaderCell>
        <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
        <Table.ColumnHeaderCell>Customer</Table.ColumnHeaderCell>
        <Table.ColumnHeaderCell>Product Ordered</Table.ColumnHeaderCell>
        <Table.ColumnHeaderCell>Order Date</Table.ColumnHeaderCell>
        <Table.ColumnHeaderCell>Concluded At</Table.ColumnHeaderCell>
        <Table.ColumnHeaderCell>remarks</Table.ColumnHeaderCell>
      </Table.Row>
    </Table.Header>
  );
};

export default TableHeader;
