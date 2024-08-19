import { Row } from "react-bootstrap";
import {
    useTable,
    useSortBy,
    usePagination,
    useFilters,
    useGlobalFilter,
} from "react-table";

const TableContainer = ({ columns, data, isLoading }: any) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
        setGlobalFilter
    }: any = useTable(
        {
            columns,
            data,
            initialState: { pageSize: 50 },
        },
        useFilters,
        useGlobalFilter,
        useSortBy,
        usePagination
    );
    
    return (
        <>
            <Row>
                <div className="fv-row mb-7 col-8">
                    <input
                        type="text"
                        placeholder="Search"
                        name="search"
                        className={"form-control form-control-solid mb-3 mb-lg-0"}
                        onChange={e => setGlobalFilter(e.target.value)}
                    />
                </div>
            </Row>
            <div className="table-responsive">
                <table
                    className="table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer"
                    {...getTableProps()}
                >
                    <thead>
                        {headerGroups?.map((headerGroup: any) => (
                            <tr
                                className="pd-2 text-start text-muted fw-bolder fs-7 text-uppercase gs-0 bg-light"
                                {...headerGroup.getHeaderGroupProps()}
                            >
                                {headerGroup.headers.map((column: any, index: any) => (
                                    <th
                                        {...column.getHeaderProps(column.getSortByToggleProps())}
                                        className={index == 0 ? "ps-4 min-w-300px rounded-start" : index == headerGroup.headers.length - 1 ? "min-w-200px rounded-end" : "" + column.id == 'Amount' ? 'text-end' : ''}
                                    >
                                        {column?.render("Header")}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>

                    <tbody className="text-gray-600 fw-bold" {...getTableBodyProps()}>
                        {(isLoading) && (
                            <tr className="text-center">
                                <td colSpan={12}><span className='spinner-border spinner-border align-middle ms-2'></span></td>
                            </tr>
                        )}
                        {(page.length > 0 && !isLoading) && page.map((row: any) => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}>
                                    {row.cells.map((cell: any) => {
                                        return (
                                            <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                        {(page.length == 0 && !isLoading) && (
                            <tr className="text-center">
                                <td colSpan={12}>Purchase Order not found</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div
                    className="d-flex align-items-center justify-content-center mt-10"
                    style={{}}
                >
                    <div className="pagination d-flex align-items-center">
                        <button
                            className={
                                canPreviousPage
                                    ? "btn btn-sm btn-primary me-5"
                                    : "btn btn-sm btn-light btn-active-light-primary me-5"
                            }
                            data-kt-menu-dismiss="true"
                            onClick={() => previousPage()}
                            disabled={!canPreviousPage}
                        >
                            Previous
                        </button>
                        <div className="d-flex align-items-center me-5">
                            <label className="d-flex align-items-center fs-5 fw-semibold me-3">
                                <span>
                                    Page {pageIndex + 1} of {pageOptions.length}
                                </span>
                            </label>
                            <input
                                className="form-control form-control-lg form-control-solid"
                                type="number"
                                defaultValue={pageIndex + 1}
                                onChange={(e) => {
                                    const page = e.target.value ? Number(e.target.value) - 1 : 0;
                                    gotoPage(page);
                                }}
                                style={{ width: "100px" }}
                            />
                        </div>
                        <select
                            className="form-select form-select-solid me-5"
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(Number(e.target.value));
                            }}
                            style={{ width: "150px" }}
                        >
                            {[2, 10, 20, 30, 40, 50].map((pageSize) => (
                                <option key={pageSize} value={pageSize}>
                                    Show {pageSize}
                                </option>
                            ))}
                        </select>
                        <button
                            className={
                                canNextPage
                                    ? "btn btn-sm btn-primary"
                                    : "btn btn-sm btn-light btn-active-light-primary me-2"
                            }
                            data-kt-menu-dismiss="true"
                            onClick={() => nextPage()}
                            disabled={!canNextPage}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TableContainer