import { useSelector } from "react-redux";
import * as XLSX from 'xlsx';
import { currencyConverter, timezoneDateConverter } from "../../../../utils/helpers";

export default function ExportEstimateExcelSheet({ data, disabled }) {
  const { user } = useSelector((state: any) => state.auth);
  const headers = ['Rerference', 'Location', 'Client', 'Amount', 'Date', 'Status', 'Related'];

  const handleExportClick = () => {
    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.aoa_to_sheet([headers, ...data?.map(item => {
      const getDate = timezoneDateConverter(item?.date, user?.userTimezone)
      const getTotal = currencyConverter(item?.total)
      return [item?.referenceNumber, item?.locationId?.locationName, item?.client?.Name, getTotal, getDate, item?.status, item?.workOrderId?.Number]
    })]);
    XLSX.utils.book_append_sheet(workbook, sheet, `Estimate Sheet`);
    XLSX.writeFile(workbook, `${new Date().getTime()}.xlsx`);
  };

  return <button onClick={handleExportClick} className="btn btn-primary" disabled={disabled}>Export Excel Sheet</button>
}
