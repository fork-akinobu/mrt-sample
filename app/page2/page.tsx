'use client'

import { MaterialReactTable, MRT_FilterFn, type MRT_Row } from "material-react-table";
import { MRT_Localization_JA } from 'material-react-table/locales/ja'
import Link from "next/link";
import { Box, Button } from '@mui/material';

import { mkConfig, generateCsv, download } from 'export-to-csv';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

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
    { id: "0004", name: "コンテンツ", status: "公開", link: "/detail/4" },
    { id: "0005", name: "コンテンツ", status: "公開", link: "/detail/5" },
    { id: "0006", name: "コンテンツ", status: "公開", link: "/detail/6" },
    { id: "0007", name: "コンテンツ", status: "公開", link: "/detail/7" },
    { id: "0008", name: "コンテンツ", status: "公開", link: "/detail/8" },
    { id: "0009", name: "コンテンツ", status: "公開", link: "/detail/9" },
    { id: "0010", name: "コンテンツ", status: "公開", link: "/detail/10" },
    { id: "0011", name: "コンテンツ", status: "公開", link: "/detail/11" },
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

  // CSVエクスポートする関数(export-to-csv未使用)
  const exportCSV = (records: any[]) => {
    // const now = new Date();
    // const yyyy = now.getFullYear();
    // const mm = String(now.getMonth() + 1).padStart(2, '0'); // 月は0から始まるので+1
    // const dd = String(now.getDate()).padStart(2, '0');
    // const hh = String(now.getHours()).padStart(2, '0');
    // const min = String(now.getMinutes()).padStart(2, '0');

    // const timestamp = `${yyyy}${mm}${dd}_${hh}${min}`; // "20990101_2359" 形式のタイムスタンプ

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

    console.log('exportCSV records:', records);
    // ヘッダー（1行目）を作成
    // 最初の要素からキー名を取得してカンマで繋ぐ
    // const headers = Object.keys(records[0]).join(",");
    const headers = Object.keys(records[0])
    .map(key => `"${key}"`)  // 各ヘッダーを"で囲む
    .join(",");
    console.log("records[0]の中身:", records[0]);

    // データをカンマ区切り、改行区切りの文字列に変換
    // let data = records.map((record) => {
    //   const row = Array.isArray(record) ? record : Object.values(record);
    //   return row.join(",");
    // }).join("\r\n");

    let data = records.map((record) => {
      const row = Array.isArray(record) ? record : Object.values(record);
      return row
        .map(value => `"${value}"`)  // 各値を"で囲む
        .join(",");
    }).join("\r\n");

    // BOM (Byte Order Mark) を作成して文字化けを防止
    let bom = new Uint8Array([0xef, 0xbb, 0xbf]);
    let blob = new Blob([bom, headers + "\r\n" + data], { type: "text/csv" });

    // ダウンロード用URLの生成とリンクのシミュレート
    let url = (window.URL || window.webkitURL).createObjectURL(blob);
    let link = document.createElement('a');
    link.href = url;
    link.download = `${timestamp}_data.csv`;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);// 追加したリンクを削除
    window.URL.revokeObjectURL(url);// メモリ解放
  }


  // export-to-csvの設定
  const baseConfig = mkConfig({ 
    useBom: true,           // Excelでの文字化けを防止（BOM設定）
    // filename: 'etc_export',  // ダウンロードされるファイル名
    // columnHeaders: ['ID', '名前', 'メールアドレス'], // ヘッダーをカスタマイズ
    useKeysAsHeaders: true, // オブジェクトのキーをヘッダーとして使用
  });

  const handleExport = (data: any[]) => {
    // データが空なら何もしない（警告を出す）
    if (!data || data.length === 0) {
      alert("エクスポートするデータがありません");
      return;
    }

    console.log('data for csv export:', data);

    // 1. 日時スタンプを作成
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

    // 2. ボタンを押した瞬間の時刻を入れた設定をその場で作る
    const csvConfig = mkConfig({
      ...baseConfig, // 共通設定をコピー
      filename: `${timestamp}_data_ex`,
    });

    const csv = generateCsv(csvConfig)(data); // データをCSV文字列に変換
    download(csvConfig)(csv);                // ブラウザでダウンロード実行
  };



  // MRT　エクスポート用の関数
  const handleExportRows = (rows: MRT_Row<any>[]) => {
    // 1. MRTのRow型から、純粋なデータオブジェクト（.original）だけを抜き出す
    const rowData = rows.map((row) => row.original);

    console.log('Exporting rows data:', rowData);
    
    // 2. 現在時刻でファイル名を作成
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    
    // 3. その場限りの設定を作って実行
    const configWithTimestamp = mkConfig({
      ...baseConfig,
      filename: `export_${timestamp}`,
    });

    const csv = generateCsv(configWithTimestamp)(rowData);
    download(configWithTimestamp)(csv);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-32 px-16 bg-gray-100 sm:items-start">
        <Link href="/" className="bg-blue-400 text-xl font-bold text-white p-4 mb-4 rounded">
            MRT Sampleへ
        </Link>

        <hr />

        <p className="text-black mt-10">CSVダウンロード</p>
        <button
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => exportCSV(data)}
        >Download CSV(manual)</button>

        <br />


         <button
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => handleExport(data)}
        >Download CSV(export to csv)</button>

        <br />



        <h2 className="text-black mt-10">Table with Export</h2>
        <MaterialReactTable
          localization={MRT_Localization_JA}
          enableRowSelection={true} // 行選択を有効化
          // enableTopToolbar={true} // 明示的にtrueにする
          renderTopToolbarCustomActions={({ table }) => (
            <Box sx={{ display: 'flex', gap: '1rem', p: '4px' }}>
              {/* 全データ（フィルタ・ソートを無視） */}
              <Button
                onClick={() => handleExportRows(table.getCoreRowModel().rows as MRT_Row<any>[])}
                startIcon={<FileDownloadIcon />}
              >
                全件出力
              </Button>
              {/* フィルタ後の内容全部） */}
              <Button
                onClick={() => handleExportRows(table.getPrePaginationRowModel().rows)}
                startIcon={<FileDownloadIcon />}
              >
                フィルタ後出力
              </Button>
              {/* 現在表示されているページのみ */}
              <Button
                disabled={table.getRowModel().rows.length === 0}
                onClick={() => handleExportRows(table.getRowModel().rows)}
                startIcon={<FileDownloadIcon />}
              >
                ページ出力
              </Button>

              {/* 選択した行のみ */}
              <Button
                disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
                onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
                startIcon={<FileDownloadIcon />}
              >
                選択分出力
              </Button>
            </Box>
          )}
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
          muiTablePaperProps={{
            sx: {
              width: '100%',
            },
          }}
          data={data}
        />
      </main>
    </div>
  );
}
