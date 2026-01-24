

interface TableProps {
  data: any[];
  columns: Column[];
  rowKey: string;
  onRowClick: (item: any) => void;
}

interface Column {
  key: string;
  label: string;
}

export const Table = ({ data, columns, rowKey, onRowClick }: TableProps) => {
  return (
    <table className="w-full text-sm">
      <thead className="bg-[#F8F8F8] border-b">
        <tr>
          {columns.map((column) => (
            <th key={column.key} className="px-4 py-3 text-left">
              {column.label}
            </th>
          ))}
        </tr>
      </thead>

      <tbody className="divide-y">
        {data.map((item) => (
          <tr key={item[rowKey]} onClick={() => onRowClick(item)}>
            {columns.map((column) => (
              <td key={column.key} className="px-4 py-3 text-sm">
                {item[column.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

