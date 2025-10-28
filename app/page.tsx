'use client'

import { MaterialReactTable, MRT_FilterFn } from "material-react-table";
import { MRT_Localization_JA } from 'material-react-table/locales/ja'
import Link from "next/link";

export default function Home() {
  type DataType = {
    id: string;
    name: string;
    status: string;
    link: string;
  }

  const data: DataType[] = [
    { id: "0001", name: "サービス", status: "作成中", link: "/detail/1" },
    { id: "0002", name: "プロダクト", status: "申請中", link: "/detail/2" },
    { id: "0003", name: "コンテンツ", status: "公開", link: "/detail/3" },
  ];


  const customGlobalFilter: MRT_FilterFn<DataType> = (row, _columnIds, filterValue) => {
    const searchValue = String(filterValue).toLowerCase();
    
    // 検索対象のキー
    const keysToSearch: (keyof DataType)[] = ['id', 'name', 'status'];
    
    return keysToSearch.some((key) => {
      const value = row.original[key];
      if (value == null) return false;
      return String(value).toLowerCase().includes(searchValue);
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-32 px-16 bg-gray-100 sm:items-start">
        <h2 className="text-black">Table 1</h2>
        <MaterialReactTable
          localization={MRT_Localization_JA}
          columns={[
            {
              accessorKey: "id",
              header: "ID",
            },
            {
              accessorKey: "name",
              header: "名称",
              Cell: ({ cell }) => {
                console.log(cell)
                return (
                  <Link href={cell.row.original.link} className="text-blue-600 underline">
                    {cell.getValue<string>()}
                  </Link>
                );
              },
            },
            {
              accessorKey: "status",
              header: "種別",
              filterVariant: "select",
              filterSelectOptions: [
                { label: "作成中", value: "作成中" },
                { label: "申請中", value: "申請中" },
                { label: "公開", value: "公開" },
              ],
              Cell: ({ cell }) => {
                const status = cell.getValue<string>();
                const bgColor =
                  status === "作成中"
                    ? "bg-gray-400"
                    : status === "申請中"
                    ? "bg-blue-400"
                    : "bg-green-400";
                return (
                  <span
                    className={`block w-20 leading-[2] text-center text-white rounded-2xl ${bgColor}`}
                  >
                    {status}
                  </span>
                );
              },
            },
          ]}
          data={data}
        />

        <h2 className="text-black mt-10">Table 2</h2>
        <MaterialReactTable
          localization={MRT_Localization_JA}
          columns={[
            {
              accessorKey: "status",
              header: "種別",
              Cell: ({ cell }) => {
                const status = cell.getValue<string>();
                const bgColor =
                  status === "作成中"
                    ? "bg-gray-400"
                    : status === "申請中"
                    ? "bg-blue-400"
                    : "bg-green-400";
                return (
                  <span
                    className={`block w-20 leading-[2] text-center text-white rounded-2xl ${bgColor}`}
                  >
                    {status}
                  </span>
                );
              },
            },
            {
              accessorKey: 'id',
              header: '申請',
              grow: true,
              Cell: ({ cell, row }) => (
                  <span>{cell.getValue<string>()} : {row.original.name}</span>
              )
            },
          ]}
          data={data}
        />

        <h2 className="text-black mt-10">Table 3 filterFn</h2>
        <MaterialReactTable
          localization={MRT_Localization_JA}
          columns={[
            {
              accessorKey: "status",
              header: "種別",
              Cell: ({ cell }) => {
                const status = cell.getValue<string>();
                const bgColor =
                  status === "作成中"
                    ? "bg-gray-400"
                    : status === "申請中"
                    ? "bg-blue-400"
                    : "bg-green-400";
                return (
                  <span
                    className={`block w-20 leading-[2] text-center text-white rounded-2xl ${bgColor}`}
                  >
                    {status}
                  </span>
                );
              },
            },
            {
              accessorKey: 'id',
              header: '申請',
              Cell: ({ cell, row }) => (
                  <span>{cell.getValue<string>()} : {row.original.name}</span>
              ),
              filterFn: (row, _columnId, filterValue) => {
                const id = row.original.id?.toString().toLowerCase() || ''
                const name = row.original.name?.toLowerCase() || ''
                const searchValue = filterValue.toLowerCase()

                return id.includes(searchValue) || name.includes(searchValue)
              }, // IDとnameでの部分一致検索を列の検索に実装
            },
          ]}
          data={data}
          globalFilterFn="customGlobalFilter"
          filterFns={{
            customGlobalFilter: customGlobalFilter
          }}
        />


        <h2 className="text-black mt-10">Table 4 accesorFn</h2>
        <MaterialReactTable
          localization={MRT_Localization_JA}
          columns={[
            {
              accessorKey: "status",
              header: "種別",
              Cell: ({ cell }) => {
                const status = cell.getValue<string>();
                const bgColor =
                  status === "作成中"
                    ? "bg-gray-400"
                    : status === "申請中"
                    ? "bg-blue-400"
                    : "bg-green-400";
                return (
                  <span
                    className={`block w-20 leading-[2] text-center text-white rounded-2xl ${bgColor}`}
                  >
                    {status}
                  </span>
                );
              },
            },
            {
              accessorFn: (row) => `${row.id} : ${row.name}`,
              header: '申請',
            },
          ]}
          data={data}
        />
      </main>
    </div>
  );
}
