import { useSelector } from "react-redux";
import * as XLSX from 'xlsx';
import { timezoneDateConverter } from "../../../../utils/helpers";

export default function ExportWorkOrderExcelSheet({ data, disabled }) {
    const { user } = useSelector((state: any) => state.auth);
    const headers = ['Status', 'WO#', 'PO#', 'Bill To', 'Client', 'Space', 'Priority', 'Description', 'Assigned To', 'Scheduled To', 'Flag', 'Contact', 'Estimate Total'];

    const handleExportClick = async () => {
        const workbook = XLSX.utils.book_new();
        const sheet = XLSX.utils.aoa_to_sheet([headers, ...data?.map(item => {
            const scheduled = timezoneDateConverter(item?.ScheduledStartUtc, user?.userTimezone)
            const estimateTotal = item?.EstimateId?.total;
            const shortLocation = item?.ShortLocation?.split("\\")[1];
            const priority = item?.Priority.label ? item?.Priority?.label : item?.Priority?.DisplayAs
            const taskRefinement = item?.TaskRefinement?.replace(/<\/?[^>]+(>|$)/g, "")
            const employee = item?.employee?.length > 0 ? item?.employee?.map(item => item?.FirstName + " " + item?.LastName).join() : item?.Employee?.DisplayAs;
            const flag = item?.Flag?.length > 0 ? item?.Flag?.map(item => item.DisplayAs).join() : ''
            const contact = item?.Contact?.length > 0 ? [...item?.Contact,...item?.BillTo?.Contacts || []]?.map(item => item?.fullName)?.join() : item.ContactName;
            const client = item?.customer ? item?.customer?.Name : item?.Customer?.Name

            return [item?.StatusId, item?.Number, item?.PoNumber, item?.BillTo?.Name, client, shortLocation, priority, taskRefinement, employee, scheduled, flag, contact, estimateTotal]
        })]);
        XLSX.utils.book_append_sheet(workbook, sheet, `Work Order Sheet`);
        XLSX.writeFile(workbook, `${new Date().getTime()}.xlsx`);
    };

    return <button onClick={handleExportClick} className="btn btn-primary mt-4" disabled={disabled}>Export Excel Sheet</button>
}
